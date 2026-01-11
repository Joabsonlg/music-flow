
"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { User, Task, Material, USERS, TASKS, FILES } from "@/lib/mock-data";

interface MockContextType {
    currentUser: User | null;
    users: User[];
    tasks: Task[];
    files: Material[];
    login: (email: string) => void;
    logout: () => void;
    addTask: (task: Task) => void;
    updateTask: (id: string, updates: Partial<Task>) => void;
    deleteTask: (id: string) => void;
    addFile: (file: Material) => void;
    getStudentTasks: (studentId: string) => Task[];
    getStudentsForTeacher: (teacherId: string) => User[];
    linkToTeacher: (inviteCode: string) => boolean;
    unlinkFromTeacher: () => void;
}

const MockContext = createContext<MockContextType | undefined>(undefined);

export function MockProvider({ children }: { children: React.ReactNode }) {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [users, setUsers] = useState<User[]>(USERS);
    const [tasks, setTasks] = useState<Task[]>(TASKS);
    const [files, setFiles] = useState<Material[]>(FILES);

    // Load user from local storage to persist login across refreshes
    useEffect(() => {
        const storedUser = localStorage.getItem("music-flow-user");
        if (storedUser) {
            try {
                const parsed = JSON.parse(storedUser);
                // Get the latest version from users state
                const latestUser = USERS.find(u => u.id === parsed.id);
                if (latestUser) {
                    setCurrentUser(latestUser);
                }
            } catch (e) {
                console.error("Failed to parse stored user", e);
            }
        }
    }, []);

    const login = (email: string) => {
        const user = users.find((u) => u.email === email);
        if (user) {
            setCurrentUser(user);
            localStorage.setItem("music-flow-user", JSON.stringify(user));
        }
    };

    const logout = () => {
        setCurrentUser(null);
        localStorage.removeItem("music-flow-user");
    };

    const addTask = (task: Task) => {
        setTasks((prev) => [...prev, task]);
    };

    const updateTask = (id: string, updates: Partial<Task>) => {
        setTasks((prev) =>
            prev.map((t) => (t.id === id ? { ...t, ...updates } : t))
        );
    };

    const deleteTask = (id: string) => {
        setTasks((prev) => prev.filter((t) => t.id !== id));
    };

    const addFile = (file: Material) => {
        setFiles((prev) => [...prev, file]);
    };

    const getStudentTasks = (studentId: string) => {
        return tasks.filter((t) => t.studentId === studentId);
    };

    const getStudentsForTeacher = (teacherId: string) => {
        return users.filter((u) => u.role === "STUDENT" && u.teacherId === teacherId);
    };

    const linkToTeacher = (inviteCode: string): boolean => {
        if (!currentUser || currentUser.role !== 'STUDENT') return false;

        const teacher = users.find(u => u.role === 'TEACHER' && u.inviteCode === inviteCode.toUpperCase());
        if (!teacher) return false;

        const updatedUser = { ...currentUser, teacherId: teacher.id };
        setUsers(prev => prev.map(u => u.id === currentUser.id ? updatedUser : u));
        setCurrentUser(updatedUser);
        localStorage.setItem("music-flow-user", JSON.stringify(updatedUser));
        return true;
    };

    const unlinkFromTeacher = () => {
        if (!currentUser || currentUser.role !== 'STUDENT') return;

        const updatedUser = { ...currentUser, teacherId: undefined };
        setUsers(prev => prev.map(u => u.id === currentUser.id ? updatedUser : u));
        setCurrentUser(updatedUser);
        localStorage.setItem("music-flow-user", JSON.stringify(updatedUser));
    };

    return (
        <MockContext.Provider
            value={{
                currentUser,
                users,
                tasks,
                files,
                login,
                logout,
                addTask,
                updateTask,
                deleteTask,
                addFile,
                getStudentTasks,
                getStudentsForTeacher,
                linkToTeacher,
                unlinkFromTeacher,
            }}
        >
            {children}
        </MockContext.Provider>
    );
}

export function useMock() {
    const context = useContext(MockContext);
    if (context === undefined) {
        throw new Error("useMock must be used within a MockProvider");
    }
    return context;
}
