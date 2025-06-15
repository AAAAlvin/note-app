import TiptapEditor from "@/components/TiptapEditor";
import DocMetaPanel from "@/components/DocMetaPanel";

type PageParams = Promise<{
  id: string;
}>;

export default async function Docs({ params }: { params: PageParams }) {
  const { id } = await params;

  return (
    <div className="flex flex-col h-screen p-4">
      {id === 'new' ? (
        <TiptapEditor initialContent={''} immediatelyRender={false} />
      ) : (
        <TiptapEditor initialContent={`${id} 번 문서`} immediatelyRender={false} />
      )}

      <div className="flex flex-row h-screen">
        <div className="w-2/4 p-10">
          <DocMetaPanel documentId={id} />
        </div>
        <div className="flex-1 p-4">
        </div>
      </div>
    </div>
  );
}