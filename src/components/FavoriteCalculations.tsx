"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, StarOff, Calculator, Heart, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';

interface Calculation {
  id: string;
  user_id: string;
  title: string;
  type: string;
  inputs: any;
  result: any;
  is_favorite: boolean;
  created_at: string;
}

export function FavoriteCalculations() {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<Calculation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadFavorites();
    }
  }, [user]);

  const loadFavorites = async () => {
    try {
      const { data, error } = await supabase
        .from('calculations')
        .select('*')
        .eq('user_id', user?.id)
        .eq('is_favorite', true)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setFavorites(data || []);
    } catch (error) {
      console.error('Erro ao carregar favoritos:', error);
      toast.error('Erro ao carregar cálculos favoritos');
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = async (calculationId: string) => {
    try {
      const { error } = await supabase
        .from('calculations')
        .update({ is_favorite: false })
        .eq('id', calculationId);

      if (error) throw error;

      setFavorites(prev => prev.filter(calc => calc.id !== calculationId));
      toast.success('Removido dos favoritos');
    } catch (error) {
      console.error('Erro ao remover favorito:', error);
      toast.error('Erro ao remover favorito');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const getTypeColor = (type: string) => {
    const colors: { [key: string]: string } = {
      'medicamento': 'bg-blue-100 text-blue-800',
      'fluidoterapia': 'bg-green-100 text-green-800',
      'anestesia': 'bg-purple-100 text-purple-800',
      'nutricao': 'bg-orange-100 text-orange-800',
      'default': 'bg-gray-100 text-gray-800'
    };
    return colors[type.toLowerCase()] || colors.default;
  };

  const getTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'medicamento':
        return '💊';
      case 'fluidoterapia':
        return '💧';
      case 'anestesia':
        return '😴';
      case 'nutricao':
        return '🥗';
      default:
        return '🧮';
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Heart className="w-5 h-5 text-red-500" />
          <CardTitle>Cálculos Favoritos</CardTitle>
        </div>
        <CardDescription>
          Seus cálculos mais utilizados e importantes ({favorites.length} favoritos)
        </CardDescription>
      </CardHeader>
      <CardContent>
        {favorites.length === 0 ? (
          <div className="text-center py-8">
            <Star className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">
              Nenhum favorito ainda
            </h3>
            <p className="text-gray-500 mb-4">
              Marque seus cálculos mais importantes como favoritos para acesso rápido
            </p>
            <Button
              onClick={() => {
                // Exemplo de como adicionar um favorito
                const exampleCalc = {
                  user_id: user?.id!,
                  title: 'Dose de Antibiótico - Cão 15kg',
                  type: 'medicamento',
                  inputs: { peso: 15, medicamento: 'Amoxicilina', dose: '20mg/kg' },
                  result: { doseTotalDiaria: '300mg', volumePorDose: '1.5ml', frequencia: 'BID' },
                  is_favorite: true
                };

                supabase
                  .from('calculations')
                  .insert([exampleCalc])
                  .then(() => {
                    loadFavorites();
                    toast.success('Cálculo de exemplo adicionado aos favoritos!');
                  });
              }}
              variant="outline"
            >
              + Adicionar Exemplo de Favorito
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Estatísticas rápidas */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg">
                <div className="flex items-center gap-2">
                  <Calculator className="w-5 h-5 text-blue-600" />
                  <span className="text-sm font-medium text-blue-800">Total</span>
                </div>
                <p className="text-2xl font-bold text-blue-900">{favorites.length}</p>
              </div>
              
              <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                  <span className="text-sm font-medium text-green-800">Mais Usado</span>
                </div>
                <p className="text-sm font-bold text-green-900">
                  {favorites.length > 0 ? favorites[0].type : 'N/A'}
                </p>
              </div>
              
              <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-lg">
                <div className="flex items-center gap-2">
                  <Heart className="w-5 h-5 text-purple-600" />
                  <span className="text-sm font-medium text-purple-800">Recente</span>
                </div>
                <p className="text-sm font-bold text-purple-900">
                  {favorites.length > 0 ? formatDate(favorites[0].created_at) : 'N/A'}
                </p>
              </div>
            </div>

            {/* Lista de favoritos */}
            <div className="space-y-3">
              {favorites.map((calculation) => (
                <div
                  key={calculation.id}
                  className="border rounded-lg p-4 hover:shadow-md transition-all hover:border-blue-200 bg-gradient-to-r from-yellow-50 to-orange-50"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-lg">{getTypeIcon(calculation.type)}</span>
                        <h3 className="font-semibold text-gray-900">{calculation.title}</h3>
                        <Badge className={getTypeColor(calculation.type)}>
                          {calculation.type}
                        </Badge>
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      </div>
                      
                      <div className="text-sm text-gray-600 space-y-2">
                        <div className="bg-white/70 p-3 rounded border-l-4 border-blue-400">
                          <strong className="text-blue-800">Entradas:</strong>
                          <div className="mt-1 text-xs">
                            {Object.entries(calculation.inputs).map(([key, value]) => (
                              <span key={key} className="inline-block mr-3">
                                <strong>{key}:</strong> {String(value)}
                              </span>
                            ))}
                          </div>
                        </div>
                        
                        <div className="bg-white/70 p-3 rounded border-l-4 border-green-400">
                          <strong className="text-green-800">Resultado:</strong>
                          <div className="mt-1 text-xs">
                            {Object.entries(calculation.result).map(([key, value]) => (
                              <span key={key} className="inline-block mr-3">
                                <strong>{key}:</strong> {String(value)}
                              </span>
                            ))}
                          </div>
                        </div>
                        
                        <div className="text-xs text-gray-500">
                          Favoritado em: {formatDate(calculation.created_at)}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 ml-4">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => toggleFavorite(calculation.id)}
                        className="p-2 hover:bg-red-50"
                        title="Remover dos favoritos"
                      >
                        <StarOff className="w-4 h-4 text-red-500" />
                      </Button>
                      
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-xs"
                      >
                        Usar Novamente
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}