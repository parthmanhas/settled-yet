import { Groups, Group, Member } from '@/app/types';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware'


type State = {
    groups: Groups;
    setGroups: (groups: Groups) => void;
    addGroup: (group: Group) => void;
    removeGroup: (groupId: string) => void;
    deleteAllGroups: () => void;
    updateGroup: (group: Group) => void;
    updateGroupName: (groupId: string, name: string) => void;
    updateMember: (groupId: string, member: Member) => void;
    addMember: (groupId: string, member: Member) => void;
    deleteMember: (groupId: string, memberId: string) => void;
    removeEmptyMembers: (groupId: string) => void;
};

export const useStore = create<State>()(
    persist(
        (set) => ({
            groups: [], // Initial state for groups
    
            // Function to set groups
            setGroups: (groups: Groups) => set({ groups }),
    
            // Function to add a group
            addGroup: (group: Group) => set((state) => ({
                groups: [...state.groups, group],
            })),
            deleteAllGroups: () => set(() => ({
                groups: []
            })),
            // Function to remove a group by ID
            removeGroup: (groupId: string) => set((state) => ({
                groups: state.groups.filter(group => group.id !== groupId),
            })),
            updateGroup: (group: Group) => set((state) => ({
                groups: [...state.groups.map(g => g.id === group.id ? group : g)]
            })),
            updateGroupName: (groupId: string, name: string) => set((state) => ({
                groups: [...state.groups.map(g => g.id === groupId ? { ...g, name } : g)]
            })),
            updateMember: (groupId: string, member: Member) => set((state) => ({
                groups: [...state.groups.map(g => g.id === groupId ? { ...g, members: [...g.members.map(m => m.id === member.id ? { ...m, ...member } : m)] } : g)]
            })),
            addMember: (groupId: string, member: Member) => set((state) => ({
                groups: [...state.groups.map(g => g.id === groupId ? { ...g, members: [...g.members, member] } : g)]
            })),
            deleteMember: (groupId: string, memberId: string) => set((state) => ({
                groups: [...state.groups.map(g => g.id === groupId ? { ...g, members: [...g.members.filter(m => m.id !== memberId)] } : g)]
            })),
            removeEmptyMembers: (groupId: string) => set((state) => ({
                groups: [...state.groups.map(g => g.id === groupId ? {...g, members: [...g.members.filter(m => m.name !== '')]} : g)]
            }))
        }),
        {
            name: 'hisaab',
            storage: createJSONStorage(() => sessionStorage),
        },
    ),
)