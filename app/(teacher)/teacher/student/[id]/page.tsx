import { USERS } from "@/lib/mock-data";
import StudentCalendarClient from "./StudentCalendarClient";

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function StudentCalendarPage({ params }: PageProps) {
    const { id } = await params;
    return <StudentCalendarClient studentId={id} />;
}

// Required for static export with dynamic routes
export function generateStaticParams() {
    return USERS.filter(u => u.role === 'STUDENT').map((user) => ({
        id: user.id,
    }));
}
