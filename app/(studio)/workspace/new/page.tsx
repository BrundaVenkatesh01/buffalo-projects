import { UnifiedCreationScreen } from "./UnifiedCreationScreen";

// Force dynamic rendering - this page must not be statically generated
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export default function WorkspaceNewPage() {
  return <UnifiedCreationScreen />;
}
