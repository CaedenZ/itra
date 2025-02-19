import HLSPlayer from "@/components/HLSPlayer";

export default function DocsPage() {
  const streamUrl = "http://sample.vodobox.net/skate_phantom_flex_4k/skate_phantom_flex_4k.m3u8"
  return (
    <div className="flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-4">Live Stream</h1>
      <HLSPlayer streamUrl={streamUrl} />
    </div>
  );
}
