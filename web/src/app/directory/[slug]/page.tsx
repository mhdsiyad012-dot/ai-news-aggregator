import ToolDetailPage, { generateMetadata as toolMetadata } from "@/app/tool/[slug]/page";

export const dynamic = "force-dynamic";
export const revalidate = 60;

export const generateMetadata = toolMetadata;
export default ToolDetailPage;
