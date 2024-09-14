import { useEffect, useState, useContext } from "react"
import { Container } from "../../components/container"
import { DashboardHeader } from "../../components/painelHeader"
import {FiTrash2} from 'react-icons/fi'

import { collection, getDocs, where, query, doc, deleteDoc } from "firebase/firestore"
import { db, storage } from "../../services/firebaseConnection"
import { ref, deleteObject } from "firebase/storage"
import { AuthContext } from "../../contexts/AuthContext"

import { toast } from "react-hot-toast";

interface ImageCarProps {
    name: string;
    uid: string;
    url: string;
}

interface CarProps {
    id: string;
    name: string;
    year: string;
    km: string;
    city: string;
    price: string;
    images: ImageCarProps[];
    uid: string;
}

export function Dashboard() {
    const {user} = useContext(AuthContext)

    const [cars, setCars] = useState<CarProps[]>([])

    useEffect(() => {
        async function loadCars() {
            if(!user?.uid){
                return
            }

            const carsRef = collection(db, "cars")
            const queryRef = query(carsRef, where("uid", "==", user?.uid))

            const snapshot = await getDocs(queryRef)
            let listCars = [] as CarProps[]

            snapshot.forEach((doc) => {
                listCars.push({
                    id: doc.id,
                    name: doc.data().name,
                    year: doc.data().year,
                    km: doc.data().km,
                    price: doc.data().price,
                    city: doc.data().city,
                    images: doc.data().images,
                    uid: doc.data().uid,
                })
            })

            console.log(listCars)

            setCars(listCars)
        }

        loadCars()
    }, [])

    async function handleDeleteCar(car: CarProps) {
        const docRef = doc(db, "cars", car.id)
        await deleteDoc(docRef)
        
        car.images.forEach(async image => {
            const imagePath = `images/${image.uid}/${image.name}`
            const imageRef = ref(storage, imagePath)

            try {
                await deleteObject(imageRef)
                setCars(cars.filter((item) => item.id !== car.id))
                toast.success("Anúncio excluído com sucesso!");
            } catch (error) {
                toast.success("Erro ao excluir o anúncio...");
                console.log("Erro ao excluir o anúncio", error);
            }
        })

        
    }

    return (
        <Container>
            <DashboardHeader/>

            <main className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {cars.map((car) => (
                <section className="w-full relative bg-white rounded-lg">
                    <button
                    onClick={() => handleDeleteCar(car)}
                    className="absolute bg-white w-14 h-14 rounded-full flex items-center justify-center right-2 top-2 drop-shadow">
                        <FiTrash2 size={26} color="#000"/>
                    </button>
                    <img
                    className="w-full rounded-lg mb-2 h-60"
                    src={car.images[0].url}
                    />
                    <p className="font-bold mt-1 px-2 mb-2">{car.name}</p>

                    <div className="flex flex-col px-2">
                        <span className="text-zinc-700">Ano {car.year} | {car.km} km</span>
                        <strong className="text-black font-bold">R$ {car.price}</strong>
                    </div>

                    <div className="w-full h-px bg-slate-200 my-2"></div>
                    <div className="px-2 pb-2">
                        <span className="text-black">
                            {car.city}
                        </span>
                    </div>
                </section>
                ))}
            </main>
        </Container>
    )
}
  
  