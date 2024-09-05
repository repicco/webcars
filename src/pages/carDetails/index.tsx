import { useState, useEffect } from "react";
import { Container } from "../../components/container";
import { FaWhatsapp } from "react-icons/fa";
import { useParams } from "react-router-dom";

import { db } from "../../services/firebaseConnection";
import { doc, getDoc } from "firebase/firestore";

import { Navigation, Pagination, Scrollbar, A11y } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

interface CarProps {
  id: string;
  name: string;
  model: string;
  city: string;
  year: string;
  km: string;
  description: string;
  created: string;
  price: string | number;
  owner: string;
  uid: string;
  whatsapp: string;
  images: ImagesCarProps;
}

interface ImagesCarProps {
  uid: string;
  name: string;
  url: string;
  map: Function;
}

export function CarDetails() {
  const { id } = useParams();
  const [car, setCar] = useState<CarProps>();
  const [slidesPerView, setSlidesPerView] = useState<number>(2);

  useEffect(() => {
    async function loadCar() {
      if (!id) {
        return;
      }

      const docRef = doc(db, "cars", id);
      getDoc(docRef)
        .then((doc) => {
          setCar({
            id: doc.id,
            name: doc.data()?.name,
            model: doc.data()?.model,
            city: doc.data()?.city,
            year: doc.data()?.year,
            km: doc.data()?.km,
            description: doc.data()?.description,
            created: doc.data()?.created,
            price: doc.data()?.price,
            owner: doc.data()?.owner,
            uid: doc.data()?.uid,
            whatsapp: doc.data()?.whatsapp,
            images: doc.data()?.images,
          });
        })
        .catch((error) => {
          console.log(error);
        });
    }

    loadCar();
  }, [id]);

  useEffect(() => {
    function handleResize() {
      if (window.innerWidth < 720) {
        setSlidesPerView(1);
        return;
      }
      setSlidesPerView(2);
    }

    handleResize;

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <Container>
      <Swiper
        modules={[Navigation, Pagination, Scrollbar, A11y]}
        slidesPerView={slidesPerView}
        pagination={{
          clickable: true,
        }}
        navigation={true}
        loop
      >
        {car?.images.map((img: ImagesCarProps) => (
          <SwiperSlide key={img.uid}>
            <img
              src={img.url}
              alt={img.name}
              className="w-full h-96 object-cover"
            />
          </SwiperSlide>
        ))}
      </Swiper>

      {car && (
        <main className="w-full bg-white rounded-lg p-6 my-4">
          <div className="flex flex-col sm:flex-row mb-4 items-center justify-between">
            <h1 className="font-bold text-3xl text-black">{car?.name}</h1>
            <h1 className="font-bold text-3xl text-black">{car?.price}</h1>
          </div>

          <p>{car?.model}</p>

          <div className="flex w-full gap-6 my-4">
            <div className="flex flex-col gap-4">
              <div>
                <p>Cidade</p>
                <strong>{car?.city}</strong>
              </div>
              <div>
                <p>Ano</p>
                <strong>{car?.year}</strong>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <div>
                <p>KM</p>
                <strong>{car?.km}</strong>
              </div>
            </div>
          </div>

          <strong>Descrição:</strong>
          <p className="mb-4">{car?.description}</p>

          <strong>Telefone / Whatsapp:</strong>
          <p className="mb-4">{car?.whatsapp}</p>

          <a
            href="#"
            className="cursor-pointer bg-green-500 w-full text-white flex items-center justify-center gap-2 my-6 h-11 text-xl rounded-lg font-medium"
          >
            Conversar com vendedor
            <FaWhatsapp size={26} color="#fff" />
          </a>
        </main>
      )}
    </Container>
  );
}
