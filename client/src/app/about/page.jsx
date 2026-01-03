import Image from "next/image";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/section/footer";
import React from "react";
import {
    FaBuilding,
    FaCogs,
    FaRecycle,
    FaUserTie,
} from "react-icons/fa";




const About = () => {

    const services = [
        {
            title: "DESIGN OF NEW BUILDING",
            icon: FaBuilding,
            description:
                "We are designing buildings from scratch for our clients on new empty plots, in line with the needs programs they will recommend.",
            extra:
                "We also design the interiors of the projects we design with a modern understanding.",
        },
        {
            title: "ENGINEERING",
            icon: FaCogs,
            description:
                "We design the structural, mechanical, and electrical projects of the projects we design with our engineers.",
            extra:
                "We design our buildings with sustainable engineering and low carbon solutions.",
        },
        {
            title: "RENOVATION & ADAPTIVE REUSE",
            icon: FaRecycle,
            description:
                "Instead of demolishing existing structures, we preserve the column and floor structure.",
            extra:
                "We re-functionalize buildings with new plans according to today's needs.",
        },
        {
            title: "CONSULTING & SUPERVISION",
            icon: FaUserTie,
            description:
                "We review projects drawn by other architects and prepare detailed reports.",
            extra:
                "We supervise projects to ensure correct construction.",
        },
    ];


    return (
        <div className="bg-white" >
            <Navbar />
            <div className="min-h-screen pt-[150px]  px-4">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {services.map((service, index) => {
                        const Icon = service.icon;

                        return (
                            <div
                                key={index}
                                className="bg-black/20 backdrop-blur-md  text-[#7a7a7a] p-8 rounded-lg flex flex-col"
                            >
                                <div className="flex items-center mb-4">
                                    <Icon className="w-6 h-6 text-[#7a7a7a]" />
                                    <h2 className="ml-2 font-bold text-lg">{service.title}</h2>
                                </div>

                                <p>{service.description}</p>

                                <p className="mt-4">{service.extra}</p>

                                <a
                                    href="#"
                                    className="mt-auto pt-6 text-sm text-blue-500 hover:underline"
                                >
                                    Read More &gt;
                                </a>
                            </div>
                        );
                    })}
                </div>

            </div>
            <section className=" py-16 px-6 text-center">
                <h2 className="text-4xl font-bold text-gray-800 mb-6">
                    WALL Corporation
                </h2>
                <p className="text-xl text-gray-700 mb-12 max-w-3xl mx-auto">
                    Kigali and Nairobi based architecture office WALL Corporation was
                    founded by architect Selim Senin in 2010. WALL continues to work on
                    various projects in Kenya, Uganda, DRC, Mozambique, and Rwanda mainly.
                    WALL Corporation is the architectural design company which has
                    received more than 91 international architectural design awards from
                    Germany, U.S.A, Italy, UK, Russia and India! WALL is a company that
                    can design buildings in any function regardless of scale and structure
                    typology. Besides the design of the building, it contains all the
                    engineering disciplines required for the construction of the building.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {/* Different Project Types */}
                    <div className="bg-white p-6 rounded-lg ">
                        <p className="text-4xl font-bold text-gray-800">37</p>
                        <p className="text-lg text-gray-600">Different Types of Project Design</p>
                    </div>

                    {/* Projects */}
                    <div className="bg-white p-6 rounded-lg ">
                        <p className="text-4xl font-bold text-gray-800">150+</p>
                        <p className="text-lg text-gray-600">Projects</p>
                    </div>

                    {/* Countries & Cities */}
                    <div className="bg-white p-6 rounded-lg ">
                        <p className="text-4xl font-bold text-gray-800">17</p>
                        <p className="text-lg text-gray-600">Countries & 36 Cities</p>
                    </div>

                    {/* Awards */}
                    <div className="bg-white p-6 rounded-lg ">
                        <p className="text-4xl font-bold text-gray-800">91</p>
                        <p className="text-lg text-gray-600">International Design Awards</p>
                    </div>
                </div>

                <div className="mt-12 text-lg text-gray-700">
 <p className="font-semibold mb-4">Architects</p>
                    <p>
                        Hospital - Shopping Mall - Houses Complex - Single Family House -
                        Factory - Museum - Business Center - Hotel - Apartments - Mosque -
                        Water Treatment Plant - Warehouse - School - Hostel - Gymnasium -
                        Art Center - Office Building - Film Institute - Sport Complex -
                        Amphitheater - Hostel - Coffee Shop - Commercial Building - Floating
                        Park - Bridge - Vertical Farm - Observation Tower - SPA - University
                        Campus - Eco Lodge - Community Park - Street Design
                    </p>
                </div>
               
            </section>
            {/* FOUNDER + CLIENTS SECTION */}
            <section className="bg-white py-24">
                <div className="max-w-7xl mx-auto px-6">

                    {/* FOUNDER */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start mb-32">

                        {/* IMAGE */}
                        <div className="w-full max-w-md">
                            <Image
                                src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d"
                                alt="Founder"
                                width={500}
                                height={400}
                                className="object-cover"
                            />
                        </div>

                        {/* TEXT */}
                        <div className="max-w-md">
                            <p className="uppercase tracking-[0.3em] text-sm text-gray-500 mb-8">
                                Founder
                            </p>

                            <p className="text-[15px] leading-7 text-gray-700 mb-8">
                                Selim Senin, graduated in 2010 from Yildiz Technical University.
                                He has a master's degree in Architecture History at Istanbul
                                Technical University.
                            </p>

                            <p className="text-[15px] leading-7 text-gray-700">
                                Approach to architecture is not to repeat the same thing is to
                                try to discover new.
                            </p>
                        </div>
                    </div>

                    {/* OUR CLIENTS */}
                    <div className="text-center mb-20">
                        <h2 className="text-[48px] tracking-[0.4em] font-medium text-gray-900">
                            OUR CLIENTS
                        </h2>
                    </div>

                    {/* CLIENT LOGOS */}
                    <div className="flex flex-wrap justify-center items-center gap-20">
                        <Image
                            src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Logo_placeholder.svg/512px-Logo_placeholder.svg.png"
                            alt="Client 1"
                            width={160}
                            height={80}
                        />
                        <Image
                            src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Logo_placeholder.svg/512px-Logo_placeholder.svg.png"
                            alt="Client 2"
                            width={160}
                            height={80}
                        />
                        <Image
                            src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Logo_placeholder.svg/512px-Logo_placeholder.svg.png"
                            alt="Client 3"
                            width={160}
                            height={80}
                        />
                    </div>

                </div>
            </section>

            <Footer />
        </div>
    );
};

export default About;
