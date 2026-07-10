import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import ChatWindow from '@/components/ChatWindow'
import Sidebar from '@/components/Sidebar'
import MobileNavDropdown from '@/components/MobileNavDropdown'

const deptRooms: Record<string, { id: string; name: string }> = {
  CSE: { id: 'c0000000-0000-0000-0000-000000000001', name: 'Comp-Sci Hub' },
  ECE: { id: 'c0000000-0000-0000-0000-000000000002', name: 'Electronics Hub' },
  MECH: { id: 'c0000000-0000-0000-0000-000000000003', name: 'Mechanical Hub' },
  CHEM: { id: 'c0000000-0000-0000-0000-000000000004', name: 'Chemical Hub' },
  CIVIL: { id: 'c0000000-0000-0000-0000-000000000005', name: 'Civil Hub' }
}

const GENERAL_ROOM_ID = 'c0000000-0000-0000-0000-000000000006'

interface SearchParams {
  room?: string
}

export default async function ChatPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // 1. Get profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (!profile) {
    redirect('/dashboard')
  }

  // 2. Auto-subscribe to General and Department channels
  const roomsToJoin = [GENERAL_ROOM_ID]
  const deptRoom = deptRooms[profile.department]
  if (deptRoom) {
    roomsToJoin.push(deptRoom.id)
  }

  for (const roomId of roomsToJoin) {
    // Check if membership exists
    const { data: membership } = await supabase
      .from('chat_room_members')
      .select('room_id')
      .eq('room_id', roomId)
      .eq('profile_id', user.id)
      .maybeSingle()

    if (!membership) {
      // Auto-join
      await supabase.from('chat_room_members').insert({
        room_id: roomId,
        profile_id: user.id
      })
    }
  }

  // 3. Fetch all rooms the user is a member of
  const { data: memberships } = await supabase
    .from('chat_room_members')
    .select('room_id')
    .eq('profile_id', user.id)

  const roomIds = memberships?.map((m) => m.room_id) || []

  // Get details for all joined rooms
  const { data: dbRooms } = await supabase
    .from('chat_rooms')
    .select('*, chat_room_members(*, profiles(full_name, permission_tier))')
    .in('id', roomIds)

  const formattedRooms = dbRooms?.map((room) => {
    let name = room.name || 'Group Chat'
    if (room.type === 'direct') {
      const otherMember = room.chat_room_members?.find(
        (m: any) => m.profile_id !== user.id
      )
      name = otherMember?.profiles?.full_name || 'Direct Chat'
    }
    return {
      ...room,
      displayName: name
    }
  }) || []

  // 4. Selected Room
  const { room: roomParam } = await searchParams
  const activeRoomId = roomParam || GENERAL_ROOM_ID

  const activeRoom = formattedRooms.find((r) => r.id === activeRoomId)
  const roomName = activeRoom?.displayName || 'Chat Room'

  // Fetch messages for active room
  const { data: messages } = await supabase
    .from('chat_messages')
    .select('*, profiles(full_name, permission_tier)')
    .eq('room_id', activeRoomId)
    .order('created_at', { ascending: true })

  const groupRooms = formattedRooms.filter((r) => r.type === 'group')
  const directRooms = formattedRooms.filter((r) => r.type === 'direct')

  return (
    <div className="min-h-screen bg-paper-bg flex flex-col md:flex-row text-ink-navy">
      <Sidebar activeSegment="chat" />

      {/* Main Content Area */}
      <div className="md:ml-64 flex flex-col flex-1 min-h-screen">
        {/* Top AppBar */}
        <header className="sticky top-0 z-40 border-b border-rule-grey bg-white h-16 flex justify-between items-center px-6 md:px-10">
          <div className="flex items-center gap-3 md:hidden">
            <MobileNavDropdown activeSegment="chat" />
          </div>
          <div className="hidden md:flex items-center gap-3">
            <h2 className="font-headline text-xl font-bold text-ink-navy">Channels & DMs</h2>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="w-8 h-8 rounded-full border border-rule-grey bg-paper-bg flex items-center justify-center overflow-hidden font-bold text-xs">
              U
            </Link>
          </div>
        </header>

        <main className="flex-1 flex flex-col lg:flex-row overflow-hidden">
          {/* Channel list column */}
          <section className="w-full lg:w-80 border-r border-rule-grey bg-white flex flex-col">
            <div className="p-4 border-b border-rule-grey bg-paper-bg/30">
              <span className="font-sans font-bold text-xs text-ink-navy tracking-wider uppercase">Active Channels</span>
            </div>

            {/* List group */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-4">
              {/* Groups Section */}
              <div className="space-y-1">
                <span className="font-sans font-bold text-[9px] text-outline uppercase tracking-wider block px-3 py-1">
                  Academic Groups
                </span>
                {groupRooms.map((room) => (
                  <Link
                    key={room.id}
                    href={`/chat?room=${room.id}`}
                    className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
                      activeRoomId === room.id
                        ? 'bg-ink-navy text-white font-bold'
                        : 'hover:bg-paper-bg text-on-surface-variant'
                    }`}
                  >
                    <div className="h-8 w-8 rounded bg-paper-bg border border-rule-grey text-ink-navy flex items-center justify-center font-bold text-xs font-mono">
                      #
                    </div>
                    <span className="text-xs font-sans truncate">{room.displayName}</span>
                  </Link>
                ))}
              </div>

              {/* Direct Messages Section */}
              {directRooms.length > 0 && (
                <div className="space-y-1">
                  <span className="font-sans font-bold text-[9px] text-outline uppercase tracking-wider block px-3 py-1">
                    Direct Messages
                  </span>
                  {directRooms.map((room) => (
                    <Link
                      key={room.id}
                      href={`/chat?room=${room.id}`}
                      className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
                        activeRoomId === room.id
                          ? 'bg-ink-navy text-white font-bold'
                          : 'hover:bg-paper-bg text-on-surface-variant'
                      }`}
                    >
                      <div className="h-8 w-8 rounded-full bg-paper-bg border border-rule-grey text-ink-navy flex items-center justify-center font-bold text-xs">
                        {room.displayName[0]?.toUpperCase() || 'D'}
                      </div>
                      <span className="text-xs font-sans truncate">{room.displayName}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </section>

          {/* Chat message thread column */}
          <ChatWindow
            roomId={activeRoomId}
            userId={user.id}
            initialMessages={messages || []}
            roomName={roomName}
          />
        </main>
      </div>
    </div>
  )
}
