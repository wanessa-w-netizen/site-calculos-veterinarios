"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Stethoscope, LogIn, Pill, Droplets, Heart, Syringe, Baby, Activity, User } from 'lucide-react';
import Link from 'next/link';

export default function HomePage() {
  const features = [
    {
      icon: <Pill className="w-6 h-6" />,
      title: "Cálculo de Medicamentos",
      description: "Doses precisas para medicamentos veterinários"
    },
    {
      icon: <Droplets className="w-6 h-6" />,
      title: "Fluidoterapia",
      description: "Cálculos de manutenção e reposição de fluidos"
    },
    {
      icon: <Heart className="w-6 h-6" />,
      title: "Transfusão Sanguínea",
      description: "Volumes seguros para transfusão"
    },
    {
      icon: <Syringe className="w-6 h-6" />,
      title: "Anestésicos",
      description: "Doses de sedativos e analgésicos"
    },
    {
      icon: <Baby className="w-6 h-6" />,
      title: "Idade Gestacional",
      description: "Cálculos para cadelas e gatas"
    },
    {
      icon: <Activity className="w-6 h-6" />,
      title: "Escore Apgar",
      description: "Avaliação de vitalidade neonatal"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 rounded-full">
              <Stethoscope className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Calculadora Vet de Bolso
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Ferramenta completa para cálculos veterinários essenciais. 
            Desenvolvida por profissionais, para profissionais.
          </p>
        </div>

        {/* Acesso com Login */}
        <div className="max-w-md mx-auto mb-16">
          <Card className="shadow-2xl border-0 hover:shadow-3xl transition-all duration-300 transform hover:-translate-y-1">
            <CardHeader className="text-center pb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-2xl font-bold text-gray-800">
                Acesso à Calculadora
              </CardTitle>
              <CardDescription className="text-gray-600">
                Faça login ou cadastre-se para acessar a calculadora veterinária
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Histórico de cálculos salvos</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Perfil personalizado</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Configurações avançadas</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Sistema de favoritos</span>
                </div>
              </div>
              <Link href="/auth" className="block">
                <Button className="w-full h-12 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-medium">
                  <LogIn className="w-4 h-4 mr-2" />
                  Entrar ou Cadastrar
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Recursos Disponíveis */}
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
            Recursos Disponíveis
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="shadow-lg border-0 hover:shadow-xl transition-all duration-300">
                <CardHeader className="text-center pb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-3 text-white">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-lg font-semibold text-gray-800">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center text-gray-600">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Aviso Legal */}
        <div className="mt-16 max-w-4xl mx-auto">
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-lg">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className="w-6 h-6 text-yellow-600 font-bold">⚠️</div>
              </div>
              <div className="ml-3">
                <h3 className="text-lg font-semibold text-yellow-800 mb-2">
                  Aviso Legal
                </h3>
                <p className="text-sm text-yellow-700">
                  Este aplicativo tem finalidade exclusivamente educativa e de apoio à tomada de decisão clínica.
                  Os cálculos devem ser sempre conferidos pelo médico-veterinário responsável antes de qualquer administração ao paciente.
                  A responsabilidade final pelas condutas clínicas e terapêuticas cabe exclusivamente ao profissional prescritor.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 text-gray-500">
          <p className="text-sm">© 2024 Calculadora Vet de Bolso</p>
          <p className="text-sm">Desenvolvido para profissionais veterinários</p>
        </div>
      </div>
    </div>
  );
}