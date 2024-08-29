"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  IoSpeedometerOutline,
  IoSyncOutline,
  IoBugOutline,
  IoColorWandOutline,
  IoCloudUploadOutline,
} from "react-icons/io5";

export default function Sidebar() {
  const pathname = usePathname();

  const isActive = (pathname: string, href: string) => {
    return pathname === href;
  };

  return (
    <div className="h-[100vh] shadow-xl bg-white">
      <div className="flex justify-center pt-6">
        <Image
          src="/logo.svg"
          alt="Logo"
          width={200}
          height={200}
          className="h-auto"
          priority={true}
        />
      </div>

      <h3 className="flex justify-center font-semibold m-2 text-2xl text-center">
        Panel de Cloud Functions
      </h3>

      <ul className="flex flex-col items-start text-[15px] text-left space-y-2 mt-10">
        <Link href="/panel" className="w-full">
          <li
            className={`flex items-center text-left cursor-pointer font-semibold pl-10 h-14 ${
              isActive(pathname, "/panel") ? "bg-gray-200" : ""
            }`}
          >
            <IoSpeedometerOutline className="text-2xl mr-2" />
            Resumen
          </li>
        </Link>
        <Link href="/panel/sincronizaciones" className="w-full">
          <li
            className={`flex items-center text-left cursor-pointer font-semibold pl-10 h-14 ${
              isActive(pathname, "/panel/sincronizaciones") ? "bg-gray-200" : ""
            }`}
          >
            <IoSyncOutline className="text-2xl mr-2" />
            Sincronizaciones
          </li>
        </Link>
        <Link href="/panel/errores" className="w-full">
          <li
            className={`flex items-center text-left cursor-pointer font-semibold pl-10 h-14 ${
              isActive(pathname, "/panel/errores") ? "bg-gray-200" : ""
            }`}
          >
            <IoBugOutline className="text-2xl mr-2" />
            Errores
          </li>
        </Link>
        <Link href="/panel/recuperaciones" className="w-full">
          <li
            className={`flex items-center text-left cursor-pointer font-semibold pl-10 h-14 ${
              isActive(pathname, "/panel/recuperaciones") ? "bg-gray-200" : ""
            }`}
          >
            <IoColorWandOutline className="text-2xl mr-2" />
            Recuperaciones
          </li>
        </Link>
        <Link href="/panel/cargas-masivas" className="w-full">
          <li
            className={`flex items-center text-left cursor-pointer font-semibold pl-10 h-14 ${
              isActive(pathname, "/panel/cargas-masivas") ? "bg-gray-200" : ""
            }`}
          >
            <IoCloudUploadOutline className="text-2xl mr-2" />
            Cargas Masivas
          </li>
        </Link>
      </ul>
    </div>
  );
}
