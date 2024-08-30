import { useState, useEffect } from "react";

import { Container } from "../../components/container";

import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "../../services/firebaseConnection";

import { Link } from "react-router-dom";

interface CarImageProps {
  name: string;
  uid: string;
  url: string;
}

interface CarProps {
  id: string;
  name: string;
  year: string;
  km: string;
  price: string;
  city: string;
  images: CarImageProps[];
  uid: string;
}

export function Home() {
  const [cars, setCars] = useState<CarProps[]>([]);
  const [loadImages, setLoadImages] = useState<string[]>([]);

  useEffect(() => {
    function loadCars() {
      const carsRef = collection(db, "cars");
      const queryRef = query(carsRef, orderBy("created", "desc"));

      getDocs(queryRef)
        .then((snapshot) => {
          let listCars = [] as CarProps[];

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
            });
          });

          setCars(listCars);
        })
        .catch((error) => {
          console.log(error);
        });
    }

    loadCars();
  }, []);

  function handleImageLoad(id: string) {
    console.log(id);
    setLoadImages((oldIds) => [...oldIds, id]);
  }

  return (
    <Container>
      <section className="bg-white p-4 rounded-lg w-full max-w-3xl mx-auto flex justify-center items-center gap-2">
        <input
          className="w-full border-2 rounded-lg h-9 px-3 outline-none"
          type="text"
          placeholder="Digite o nome do carro..."
        />
        <button className="bg-red-500 h-9 px-8 rounded-lg text-white text-lg font-medium">
          Buscar
        </button>
      </section>

      <h1 className="font-bold text-center mt-6 text-2xl mb-4">
        Carros novos e usados em todo o Brasil
      </h1>

      <main className="grid gap-5 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {cars.map((car) => (
          <Link to={`/car/${car.id}`} key={car.id}>
            <section>
              <div
                className="w-full h-72 rounded-lg bg-slate-200"
                style={{
                  display: loadImages.includes(car.id) ? "none" : "block",
                }}
              ></div>

              <img
                className="w-full rounded-lg mb-2 h-72 hover:scale-105 transition-all object-contain"
                src={car.images[0].url}
                alt="Carro"
                onLoad={() => handleImageLoad(car.id)}
                style={{
                  display: loadImages.includes(car.id) ? "block" : "none",
                }}
              />

              <p className="font-bold mt-1 mb-2 px-2">{car.name}</p>

              <div className="flex flex-col scroll-px-20">
                <span className="text-zinc-700 mb-6">
                  Ano {car.year} | {car.km} km{" "}
                </span>
                <strong className="text-black font-medium text-xl">
                  R$ {car.price}
                </strong>
              </div>

              <div className="w-full h-px bg-slate-200 my-2"></div>

              <div className="px-2 pb-2">
                <span className="text-black">{car.city}</span>
              </div>
            </section>
          </Link>
        ))}
      </main>
    </Container>
  );
}
