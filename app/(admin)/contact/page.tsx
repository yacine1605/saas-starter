import Image from "next/image";
import img from "../../../components/imgs/image.png";

const contact = () => {
  return (
    <main className="flex flex-col min-h-screen">
      <section className="flex-1 flex flex-col justify-center items-center">
        <ul>
          <div className="flex flex-row p-2  justify-start items-center ">
            <li className="items-center text-xl font-bold ">Sarl DigitservZ</li>
            <Image src={img} alt="My logo" />
          </div>
          <div className="flex flex-row p-2  justify-start items-center ">
            <li className="items-center text-xl font-bold ">
              Whatsapp: 0775 96 96 42
            </li>
          </div>
          <div className="flex flex-row p-2  justify-start items-center ">
            <li className="items-center text-xl font-bold ">
              Email: mrigal.digitservz@gmail.com
            </li>
          </div>
        </ul>
      </section>
    </main>
  );
};
export default contact;
