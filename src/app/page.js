"use client";

import HomeStandard from "@/components/home/home";
import Navbar from '@/components/Navbars/navbar';
import * as React from "react";


export default function Home() {
  const [asignatura, setAsignatura] = React.useState([]);

  return (
    <>
      <Navbar />
      <HomeStandard />
    </>
  );
}
