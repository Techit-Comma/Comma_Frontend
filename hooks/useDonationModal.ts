import {create} from 'zustand'

interface DonationModalStore{
    isOpen:boolean;
    onOpen:()=>void;
    onClose:()=>void;
}

const useDonationModal = create<DonationModalStore>((set)=>({
    isOpen: false,
    onOpen: () => set({isOpen:true}),
    onClose: () => set({isOpen:false}),
}))

export default useDonationModal