import { NotFoundState } from "../components/NotFoundState";

const MESSAGE = {
  en: "This page does not exist in the Chapter 1 pilot MVP.",
  ar: "هذه الصفحة غير موجودة في النسخة التجريبية لتطبيق الفصل الأول.",
} as const;

export function NotFoundPage() {
  return <NotFoundState message={MESSAGE} backTo="home" />;
}
