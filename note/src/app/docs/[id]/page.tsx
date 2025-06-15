import TiptapEditor from "@/components/TiptapEditor";
import DocMetaPanel from "@/components/DocMetaPanel";

type PageProps = Promise<{
  params: {
    id: string;
  }
}>;

const Docs = async ({ params }: {params: PageProps}) => {
  const id = await params;

  return (
    <div className="flex flex-col h-screen p-4">
      {id.params.id === 'new' ? (
        <TiptapEditor initialContent={''} />
      ) : (
        <TiptapEditor initialContent={`${id} 번 문서`} />
      )}

      <div className="flex flex-row h-screen">
        <div className="w-2/4 p-10">
          <DocMetaPanel
            tags={["tag1", "tag2", "tag3"]}
            selectedTags={[]}
            onTagsChange={() => {}}
            members={["member1", "member2", "member3"]}
            selectedMembers={[]}
            onMembersChange={() => {}}
          />
        </div>
        <div className="flex-1 p-4">
        </div>
      </div>
    </div>
  );
}

export default Docs;