
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, Star, QrCode, Globe, ArrowRight, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import MemorialLogo from '@/components/MemorialLogo';

const SalesPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <MemorialLogo />
            <div className="flex items-center space-x-4">
              <Link to="/admin-panel">
                <Button variant="outline" size="sm">
                  Admin
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Preserve Memórias Para Sempre
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Crie um memorial digital único e especial para homenagear a vida de quem você ama. 
            Compartilhe histórias, fotos e memórias que durarão para sempre.
          </p>
          <Link to="/criar-memorial">
            <Button size="lg" className="text-lg px-8 py-4">
              Criar Memorial Agora
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Por que escolher Remember Me?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardHeader>
                <Heart className="h-12 w-12 text-red-500 mx-auto mb-4" />
                <CardTitle>Memorial Personalizado</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Crie um espaço único com fotos, vídeos, áudios e histórias especiais
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <QrCode className="h-12 w-12 text-blue-500 mx-auto mb-4" />
                <CardTitle>QR Code Exclusivo</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Compartilhe facilmente com um QR Code para colocar em lápides ou lembrança
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Globe className="h-12 w-12 text-green-500 mx-auto mb-4" />
                <CardTitle>Acesso Online</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Memorial acessível 24/7 de qualquer lugar do mundo para familiares e amigos
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Como Funciona
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">1</span>
              </div>
              <h3 className="font-semibold mb-2">Preencha o Formulário</h3>
              <p className="text-gray-600 text-sm">Forneça as informações básicas e conte a história</p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-green-600">2</span>
              </div>
              <h3 className="font-semibold mb-2">Análise e Aprovação</h3>
              <p className="text-gray-600 text-sm">Nossa equipe revisa e prepara seu memorial</p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-purple-600">3</span>
              </div>
              <h3 className="font-semibold mb-2">Memorial Criado</h3>
              <p className="text-gray-600 text-sm">Seu memorial é publicado com URL única</p>
            </div>
            <div className="text-center">
              <div className="bg-red-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-red-600">4</span>
              </div>
              <h3 className="font-semibold mb-2">Compartilhe</h3>
              <p className="text-gray-600 text-sm">Receba o QR Code e compartilhe com todos</p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Um Legado Digital Eterno
              </h2>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-6 w-6 text-green-500 mt-1" />
                  <div>
                    <h3 className="font-semibold">Hospedagem Segura</h3>
                    <p className="text-gray-600">Seus dados ficam seguros em servidores confiáveis</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-6 w-6 text-green-500 mt-1" />
                  <div>
                    <h3 className="font-semibold">Design Responsivo</h3>
                    <p className="text-gray-600">Funciona perfeitamente em celulares, tablets e computadores</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-6 w-6 text-green-500 mt-1" />
                  <div>
                    <h3 className="font-semibold">Suporte Completo</h3>
                    <p className="text-gray-600">Nossa equipe te ajuda em todo o processo</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg p-8 text-white text-center">
              <Star className="h-16 w-16 mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-4">Memorial Premium</h3>
              <p className="mb-6">Inclui tudo que você precisa para criar um memorial completo e emocionante</p>
              <ul className="text-left space-y-2 mb-6">
                <li>✓ Página personalizada</li>
                <li>✓ QR Code exclusivo</li>
                <li>✓ Galeria de fotos ilimitada</li>
                <li>✓ Vídeos e áudios</li>
                <li>✓ Biografia completa</li>
                <li>✓ Suporte vitalício</li>
              </ul>
              <Link to="/criar-memorial">
                <Button size="lg" variant="secondary" className="w-full">
                  Criar Meu Memorial
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold mb-6">
            Honre a Memória de Quem Você Ama
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Crie um memorial digital que preservará as memórias mais preciosas para sempre.
          </p>
          <Link to="/criar-memorial">
            <Button size="lg" variant="secondary" className="text-lg px-8 py-4">
              Começar Agora
              <Heart className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <MemorialLogo />
          <p className="mt-4 text-gray-400">
            © 2024 Remember Me. Preservando memórias com amor e cuidado.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default SalesPage;
