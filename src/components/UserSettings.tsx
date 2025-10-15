"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Settings, Save, Palette, Globe, Bell, Database } from 'lucide-react';
import { toast } from 'sonner';

interface UserSettings {
  id: string;
  theme: string;
  language: string;
  notifications: boolean;
  auto_save: boolean;
  default_units: {
    weight: string;
    volume: string;
    temperature: string;
  };
}

export function UserSettings() {
  const { user } = useAuth();
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      loadSettings();
    }
  }, [user]);

  const loadSettings = async () => {
    try {
      // Corrigido: usar id diretamente, pois a tabela user_settings usa id como chave primária
      const { data, error } = await supabase
        .from('user_settings')
        .select('*')
        .eq('id', user?.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        // Se não encontrar o registro, criar um novo
        if (error.code === 'PGRST116') {
          await createDefaultSettings();
        } else {
          throw error;
        }
      } else if (data) {
        setSettings(data);
      } else {
        await createDefaultSettings();
      }
    } catch (error) {
      console.error('Erro ao carregar configurações:', error);
      // Em caso de erro, criar configurações padrão localmente
      await createDefaultSettings();
    } finally {
      setLoading(false);
    }
  };

  const createDefaultSettings = async () => {
    const defaultSettings = {
      id: user?.id!,
      theme: 'light',
      language: 'pt-BR',
      notifications: true,
      auto_save: true,
      default_units: {
        weight: 'kg',
        volume: 'ml',
        temperature: 'celsius'
      }
    };

    try {
      const { error: insertError } = await supabase
        .from('user_settings')
        .insert([defaultSettings]);

      if (!insertError) {
        setSettings(defaultSettings);
      } else {
        // Se falhar ao inserir, usar configurações padrão localmente
        setSettings(defaultSettings);
      }
    } catch (error) {
      // Em caso de erro, usar configurações padrão localmente
      setSettings(defaultSettings);
    }
  };

  const handleSave = async () => {
    if (!settings) return;

    setSaving(true);
    try {
      const { error } = await supabase
        .from('user_settings')
        .upsert({
          id: user?.id,
          theme: settings.theme,
          language: settings.language,
          notifications: settings.notifications,
          auto_save: settings.auto_save,
          default_units: settings.default_units,
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;

      toast.success('Configurações salvas com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar configurações:', error);
      toast.error('Erro ao salvar configurações');
    } finally {
      setSaving(false);
    }
  };

  const updateSetting = (key: keyof UserSettings, value: any) => {
    if (settings) {
      setSettings({ ...settings, [key]: value });
    }
  };

  const updateDefaultUnit = (unitType: keyof UserSettings['default_units'], value: string) => {
    if (settings) {
      setSettings({
        ...settings,
        default_units: {
          ...settings.default_units,
          [unitType]: value
        }
      });
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

  if (!settings) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-center text-gray-500">Erro ao carregar configurações</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-blue-600" />
            <CardTitle>Configurações</CardTitle>
          </div>
          <Button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Salvando...' : 'Salvar'}
          </Button>
        </div>
        <CardDescription>
          Personalize sua experiência na aplicação
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Aparência */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Palette className="w-4 h-4 text-blue-600" />
            <h3 className="font-semibold">Aparência</h3>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="theme">Tema</Label>
            <Select
              value={settings.theme}
              onValueChange={(value) => updateSetting('theme', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o tema" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Claro</SelectItem>
                <SelectItem value="dark">Escuro</SelectItem>
                <SelectItem value="system">Sistema</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Idioma */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-blue-600" />
            <h3 className="font-semibold">Idioma e Região</h3>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="language">Idioma</Label>
            <Select
              value={settings.language}
              onValueChange={(value) => updateSetting('language', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o idioma" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pt-BR">Português (Brasil)</SelectItem>
                <SelectItem value="en-US">English (US)</SelectItem>
                <SelectItem value="es-ES">Español</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Notificações */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-blue-600" />
            <h3 className="font-semibold">Notificações</h3>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="notifications">Receber notificações</Label>
              <p className="text-sm text-gray-500">
                Receba alertas sobre atualizações e lembretes
              </p>
            </div>
            <Switch
              id="notifications"
              checked={settings.notifications}
              onCheckedChange={(checked) => updateSetting('notifications', checked)}
            />
          </div>
        </div>

        {/* Salvamento Automático */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-blue-600" />
            <h3 className="font-semibold">Dados</h3>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="auto_save">Salvamento automático</Label>
              <p className="text-sm text-gray-500">
                Salvar automaticamente os cálculos no histórico
              </p>
            </div>
            <Switch
              id="auto_save"
              checked={settings.auto_save}
              onCheckedChange={(checked) => updateSetting('auto_save', checked)}
            />
          </div>
        </div>

        {/* Unidades Padrão */}
        <div className="space-y-4">
          <h3 className="font-semibold">Unidades Padrão</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="weight_unit">Peso</Label>
              <Select
                value={settings.default_units.weight}
                onValueChange={(value) => updateDefaultUnit('weight', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="kg">Quilogramas (kg)</SelectItem>
                  <SelectItem value="g">Gramas (g)</SelectItem>
                  <SelectItem value="lb">Libras (lb)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="volume_unit">Volume</Label>
              <Select
                value={settings.default_units.volume}
                onValueChange={(value) => updateDefaultUnit('volume', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ml">Mililitros (ml)</SelectItem>
                  <SelectItem value="l">Litros (l)</SelectItem>
                  <SelectItem value="fl_oz">Onças fluidas (fl oz)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="temperature_unit">Temperatura</Label>
              <Select
                value={settings.default_units.temperature}
                onValueChange={(value) => updateDefaultUnit('temperature', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="celsius">Celsius (°C)</SelectItem>
                  <SelectItem value="fahrenheit">Fahrenheit (°F)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Botão de Salvar */}
        <div className="pt-4 border-t">
          <Button onClick={handleSave} disabled={saving} className="w-full">
            {saving ? 'Salvando configurações...' : 'Salvar todas as configurações'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}