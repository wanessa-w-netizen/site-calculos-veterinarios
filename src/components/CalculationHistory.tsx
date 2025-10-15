"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { History, Search, Star, StarOff, Trash2, Calculator, Calendar } from 'lucide-react';
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

export function CalculationHistory() {
  const { user } = useAuth();
  const [calculations, setCalculations] = useState<Calculation[]>([]);
  const [filteredCalculations, setFilteredCalculations] = useState<Calculation[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'favorites'>('all');

  useEffect(() => {
    if (user) {
      loadCalculations();
    }
  }, [user]);

  useEffect(() => {
    filterCalculations();
  }, [calculations, searchTerm, filterType]);

  const loadCalculations = async () => {
    try {
      const { data, error } = await supabase
        .from('calculations')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setCalculations(data || []);
    } catch (error) {
      console.error('Erro ao carregar histórico:', error);
      toast.error('Erro ao carregar histórico de cálculos');
    } finally {
      setLoading(false);
    }
  };

  const filterCalculations = () => {
    let filtered = calculations;

    if (filterType === 'favorites') {
      filtered = filtered.filter(calc => calc.is_favorite);
    }

    if (searchTerm) {
      filtered = filtered.filter(calc =>
        calc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        calc.type.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredCalculations(filtered);
  };

  const toggleFavorite = async (calculationId: string, currentFavorite: boolean) => {
    try {
      const { error } = await supabase
        .from('calculations')
        .update({ is_favorite: !currentFavorite })
        .eq('id', calculationId);

      if (error) throw error;

      setCalculations(prev =>
        prev.map(calc =>
          calc.id === calculationId
            ? { ...calc, is_favorite: !currentFavorite }
            : calc
        )
      );

      toast.success(
        !currentFavorite ? 'Adicionado aos favoritos' : 'Removido dos favoritos'
      );
    } catch (error) {
      console.error('Erro ao atualizar favorito:', error);
      toast.error('Erro ao atualizar favorito');
    }
  };

  const saveNewCalculation = async (title: string, type: string, inputs: any, result: any) => {
    try {
      const { data, error } = await supabase
        .from('calculations')
        .insert([{
          user_id: user?.id,
          title,
          type,
          inputs,
          result,
          is_favorite: false
        }])
        .select()
        .single();

      if (error) throw error;

      setCalculations(prev => [data, ...prev]);
      toast.success('Cálculo salvo no histórico');
    } catch (error) {
      console.error('Erro ao salvar cálculo:', error);
      toast.error('Erro ao salvar cálculo');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
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
          <History className="w-5 h-5 text-blue-600" />
          <CardTitle>Histórico de Cálculos</CardTitle>
        </div>
        <CardDescription>
          Visualize e gerencie seus cálculos salvos
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Filtros e Busca */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Buscar cálculos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant={filterType === 'all' ? 'default' : 'outline'}
              onClick={() => setFilterType('all')}
              size="sm"
            >
              Todos ({calculations.length})
            </Button>
            <Button
              variant={filterType === 'favorites' ? 'default' : 'outline'}
              onClick={() => setFilterType('favorites')}
              size="sm"
              className="flex items-center gap-1"
            >
              <Star className="w-4 h-4" />
              Favoritos ({calculations.filter(c => c.is_favorite).length})
            </Button>
          </div>
        </div>

        {/* Lista de Cálculos */}
        {filteredCalculations.length === 0 ? (
          <div className="text-center py-8">
            <Calculator className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">
              {searchTerm || filterType === 'favorites' 
                ? 'Nenhum cálculo encontrado' 
                : 'Nenhum cálculo salvo ainda'}
            </h3>
            <p className="text-gray-500">
              {searchTerm || filterType === 'favorites'
                ? 'Tente ajustar os filtros de busca'
                : 'Seus cálculos salvos aparecerão aqui'}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredCalculations.map((calculation) => (
              <div
                key={calculation.id}
                className="border rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold">{calculation.title}</h3>
                      <Badge className={getTypeColor(calculation.type)}>
                        {calculation.type}
                      </Badge>
                      {calculation.is_favorite && (
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      )}
                    </div>
                    
                    <div className="text-sm text-gray-600 space-y-1">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {formatDate(calculation.created_at)}
                      </div>
                      
                      {/* Mostrar alguns inputs principais */}
                      <div className="bg-gray-50 p-2 rounded text-xs">
                        <strong>Entradas:</strong> {JSON.stringify(calculation.inputs, null, 2).slice(0, 100)}...
                      </div>
                      
                      {/* Mostrar resultado */}
                      <div className="bg-blue-50 p-2 rounded text-xs">
                        <strong>Resultado:</strong> {JSON.stringify(calculation.result, null, 2).slice(0, 100)}...
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-1 ml-4">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => toggleFavorite(calculation.id, calculation.is_favorite)}
                      className="p-2"
                    >
                      {calculation.is_favorite ? (
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      ) : (
                        <StarOff className="w-4 h-4 text-gray-400" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Exemplo de como salvar um novo cálculo */}
        <div className="border-t pt-4">
          <Button
            onClick={() => {
              // Exemplo de como salvar um cálculo
              saveNewCalculation(
                'Cálculo de Medicamento - Exemplo',
                'medicamento',
                { peso: 10, dose: 5, frequencia: 'BID' },
                { doseTotalDiaria: '50mg', volumePorDose: '2.5ml' }
              );
            }}
            variant="outline"
            size="sm"
            className="w-full"
          >
            + Salvar Cálculo de Exemplo
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}