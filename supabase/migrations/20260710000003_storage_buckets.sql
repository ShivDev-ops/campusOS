-- Insert listings bucket into storage.buckets
INSERT INTO storage.buckets (id, name, public)
VALUES ('listings', 'listings', true)
ON CONFLICT (id) DO NOTHING;

-- Storage object policies for listings
CREATE POLICY "Public select on listings bucket" ON storage.objects
  FOR SELECT USING (bucket_id = 'listings');

CREATE POLICY "Authenticated insert on listings bucket" ON storage.objects
  FOR INSERT TO authenticated WITH CHECK (bucket_id = 'listings');

CREATE POLICY "Authenticated update on listings bucket" ON storage.objects
  FOR UPDATE TO authenticated USING (bucket_id = 'listings');

CREATE POLICY "Authenticated delete on listings bucket" ON storage.objects
  FOR DELETE TO authenticated USING (bucket_id = 'listings');
