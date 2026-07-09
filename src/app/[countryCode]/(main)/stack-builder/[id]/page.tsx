import StackDetailClient from "@components/stack-builder/stack-detail-client"

export default async function StackDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  return <StackDetailClient goalId={id} />
}
