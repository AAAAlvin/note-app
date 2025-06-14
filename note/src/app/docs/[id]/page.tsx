import TiptapEditor from "@/components/TiptapEditor";

interface PageProps {
  params: Promise<{
    id?: string;
  }>;
}

export default async function Docs({ params }: PageProps) {
  const { id } = await params;
  return (
    <div className="flex flex-col h-screen p-4">
      <TiptapEditor initialContent={`${id} 번 문서`} />
    </div>
  );
}
