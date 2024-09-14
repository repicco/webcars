import { useEffect, useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import logoImg from '../../assets/logo.svg'
import { Container } from '../../components/container'
import { Input } from '../../components/input'

import {useForm} from 'react-hook-form'
import {z} from 'zod'
import {zodResolver} from '@hookform/resolvers/zod'

import { auth } from '../../services/firebaseConnection'
import { createUserWithEmailAndPassword, updateProfile, signOut} from 'firebase/auth'
import { AuthContext } from '../../contexts/AuthContext'

import toast from "react-hot-toast";

const schema = z.object({
  name: z.string().min(1, "O campo nome é obrigatório"),
  email: z
    .string()
    .min(1, "O campo e-mail é obrigatório")
    .email("Digite um e-mail válido"),
  password: z.string().min(6, "O campo senha deve ter pelo menos 6 caracteres"),
});

type FormData = z.infer<typeof schema>;

export function Register() {
  const navigate = useNavigate();
  const { handleInfoUser } = useContext(AuthContext);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: "onChange",
  });

  async function onSubmit(data: FormData) {
    createUserWithEmailAndPassword(auth, data.email, data.password)
      .then(async (user) => {
        await updateProfile(user.user, {
          displayName: data.name,
        });

        handleInfoUser({
          name: data.name,
          email: data.email,
          uid: user.user.uid,
        });
        toast.success("Bem vindo ao Webcars"); // Use toast.success para exibir a mensagem de sucesso
        navigate("/dashboard", { replace: true });
      })
      .catch((error) => {
        toast.success("Erro ao cadastrar o usuário");
        console.log("Erro ao cadastrar o usuário", error);
      });
  }

  useEffect(() => {
    async function handleLogout() {
      await signOut(auth);
    }

    handleLogout();
  }, []);

  return (
    <Container>
      <section className=" w-full min-h-screen flex flex-col items-center justify-center gap-4">
        <Link to="/" className="mb-6 max-w-sm w-full">
          <img src={logoImg} alt="Logo do site" className="w-full" />
        </Link>

        <form
          className="bg-white max-w-xl w-full rounded-lg p-4"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="mb-3">
            <Input
              type="name"
              placeholder="Digite seu nome completo"
              name="name"
              error={errors.name?.message}
              register={register}
            />
          </div>

          <div className="mb-3">
            <Input
              type="email"
              placeholder="Digite seu e-mail"
              name="email"
              error={errors.email?.message}
              register={register}
            />
          </div>

          <div className="mb-3">
            <Input
              type="password"
              placeholder="Digite sua senha"
              name="password"
              error={errors.password?.message}
              register={register}
            />
          </div>

          <button className="bg-zinc-900 w-full rounded-md text-white h-10 font-medium">
            Cadastrar
          </button>
        </form>

        <Link to={"/login"}>Já possui uma conta? Faça login!</Link>
      </section>
    </Container>
  );
}
  
  