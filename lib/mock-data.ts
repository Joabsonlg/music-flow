
export type UserRole = 'STUDENT' | 'TEACHER';

export interface User {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    avatarUrl?: string;
    teacherId?: string;
    inviteCode?: string; // Only for teachers
}


export interface Material {
    id: string;
    title: string;
    type: 'PDF' | 'LINK';
    url: string;
    uploadedBy?: string;
}


export interface Task {
    id: string;
    studentId: string;
    createdByUserId: string;
    title: string;
    date: string;
    durationMinutes: number;
    objective: string;
    status: 'TODO' | 'DONE';
    materials: Material[];
    feedback?: {
        rating: number;
        comment?: string;
    };
}

// MOCK DATA

export const USERS: User[] = [
    {
        id: 'student-1',
        name: 'Alice Pianista',
        email: 'alice@example.com',
        role: 'STUDENT',
        teacherId: 'teacher-1',
        avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alice'
    },
    {
        id: 'student-2',
        name: 'Bob Baterista',
        email: 'bob@example.com',
        role: 'STUDENT',
        avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bob'
    },
    {
        id: 'student-3',
        name: 'Carlos Violinista',
        email: 'carlos@example.com',
        role: 'STUDENT',
        teacherId: 'teacher-1',
        avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Carlos'
    },
    {
        id: 'student-4',
        name: 'Diana Guitarrista',
        email: 'diana@example.com',
        role: 'STUDENT',
        teacherId: 'teacher-1',
        avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Diana'
    },
    {
        id: 'student-5',
        name: 'Eduardo Flautista',
        email: 'eduardo@example.com',
        role: 'STUDENT',
        teacherId: 'teacher-1',
        avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Eduardo'
    },
    {
        id: 'teacher-1',
        name: 'Maestro João',
        email: 'john@maestro.com',
        role: 'TEACHER',
        avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
        inviteCode: 'MAESTRO123'
    }
];

export const FILES: Material[] = [
    { id: 'f1', title: 'Hanon - O Pianista Virtuoso', type: 'PDF', url: 'https://imslp.org/wiki/Special:ImagefromIndex/03158/hAA23.pdf', uploadedBy: 'student-1' },
    { id: 'f2', title: 'Bach - 15 Invenções', type: 'PDF', url: 'https://imslp.org/wiki/Special:ImagefromIndex/00747/hAA23.pdf', uploadedBy: 'teacher-1' },
    { id: 'f3', title: 'Chopin - Noturno Op 9 No 2', type: 'PDF', url: 'https://imslp.org/wiki/Special:ImagefromIndex/00452/hAA23.pdf', uploadedBy: 'student-1' }
];

export const TASKS: Task[] = [

    {
        id: 'task-1',
        studentId: 'student-1',
        createdByUserId: 'student-1',
        title: 'Exercícios Hanon No. 1-5',
        date: new Date().toISOString().split('T')[0],
        durationMinutes: 20,
        objective: 'Aumentar independência e igualdade dos dedos.',
        status: 'TODO',
        materials: [
            { id: 'mat-1', title: 'Hanon Parte 1', type: 'PDF', url: 'https://imslp.org/wiki/Special:ImagefromIndex/03158/hAA23.pdf' }
        ]
    },
    {
        id: 'task-2',
        studentId: 'student-1',
        createdByUserId: 'teacher-1',
        title: 'Bach Minueto em Sol',
        date: new Date().toISOString().split('T')[0],
        durationMinutes: 30,
        objective: 'Focar no fraseado e articulação da mão direita.',
        status: 'TODO',
        materials: []
    },
    {
        id: 'task-3',
        studentId: 'student-1',
        createdByUserId: 'student-1',
        title: 'Escala Dó Maior',
        date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
        durationMinutes: 15,
        objective: 'Tom uniforme e passagem do polegar.',
        status: 'DONE',
        materials: [],
        feedback: {
            rating: 4,
            comment: 'Foi bem, mas a descida precisa de mais prática.'
        }
    }
];
