import { FullPageLoader } from "@/components/status/FullPageLoader";

export default function AuthLoading() {
  return <FullPageLoader message="Loading authentication" fullHeight={false} />;
}
