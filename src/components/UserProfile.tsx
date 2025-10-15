"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { User, Save, Edit3, Camera } from 'lucide-react';
import { toast } from 'sonner';

interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  specialty: string | null;
  phone: string | null;
  location: string | null;
}

export function UserProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      loadProfile();
    }
  }, [user]);

  const loadProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setProfile(data);
      } else {
        // Criar perfil inicial se não existir
        const newProfile = {
          id: user?.id!,
          email: user?.email!,
          full_name: user?.user_metadata?.full_name || null,
          avatar_url: null,
          bio: null,
          specialty: null,
          phone: null,
          location: null,
        };
        
        const { error: insertError } = await supabase
          .from('profiles')
          .insert([newProfile]);

        if (!insertError) {
          setProfile(newProfile);
        }
      }
    } catch (error) {
      console.error('Erro ao carregar perfil:', error);
      toast.error('Erro ao carregar perfil');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!profile) return;

    setSaving(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: profile.full_name,
          bio: profile.bio,
          specialty: profile.specialty,
          phone: profile.phone,
          location: profile.location,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user?.id);

      if (error) throw error;

      setIsEditing(false);
      toast.success('Perfil atualizado com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar perfil:', error);
      toast.error('Erro ao salvar perfil');
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field: keyof Profile, value: string) => {
    if (profile) {
      setProfile({ ...profile, [field]: value });
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

  if (!profile) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-center text-gray-500">Erro ao carregar perfil</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-blue-600" />
            <CardTitle>Meu Perfil</CardTitle>
          </div>
          <Button
            onClick={() => isEditing ? handleSave() : setIsEditing(true)}
            disabled={saving}
            className="flex items-center gap-2"
          >
            {isEditing ? (
              <>
                <Save className="w-4 h-4" />
                {saving ? 'Salvando...' : 'Salvar'}
              </>
            ) : (
              <>
                <Edit3 className="w-4 h-4" />
                Editar
              </>
            )}
          </Button>
        </div>
        <CardDescription>
          Gerencie suas informações pessoais e profissionais
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Avatar */}
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center">
              <User className="w-10 h-10 text-white" />
            </div>
            {isEditing && (
              <Button
                size="sm"
                className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 p-0"
                variant="secondary"
              >
                <Camera className="w-4 h-4" />
              </Button>
            )}
          </div>
          <div>
            <h3 className="font-semibold text-lg">
              {profile.full_name || 'Nome não informado'}
            </h3>
            <p className="text-gray-600">{profile.email}</p>
          </div>
        </div>

        {/* Informações Básicas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="full_name">Nome Completo</Label>
            {isEditing ? (
              <Input
                id="full_name"
                value={profile.full_name || ''}
                onChange={(e) => handleInputChange('full_name', e.target.value)}
                placeholder="Seu nome completo"
              />
            ) : (
              <p className="p-2 bg-gray-50 rounded-md">
                {profile.full_name || 'Não informado'}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="specialty">Especialidade</Label>
            {isEditing ? (
              <Input
                id="specialty"
                value={profile.specialty || ''}
                onChange={(e) => handleInputChange('specialty', e.target.value)}
                placeholder="Ex: Clínica Geral, Cirurgia..."
              />
            ) : (
              <p className="p-2 bg-gray-50 rounded-md">
                {profile.specialty || 'Não informado'}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Telefone</Label>
            {isEditing ? (
              <Input
                id="phone"
                value={profile.phone || ''}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder="(11) 99999-9999"
              />
            ) : (
              <p className="p-2 bg-gray-50 rounded-md">
                {profile.phone || 'Não informado'}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Localização</Label>
            {isEditing ? (
              <Input
                id="location"
                value={profile.location || ''}
                onChange={(e) => handleInputChange('location', e.target.value)}
                placeholder="Cidade, Estado"
              />
            ) : (
              <p className="p-2 bg-gray-50 rounded-md">
                {profile.location || 'Não informado'}
              </p>
            )}
          </div>
        </div>

        {/* Bio */}
        <div className="space-y-2">
          <Label htmlFor="bio">Biografia</Label>
          {isEditing ? (
            <Textarea
              id="bio"
              value={profile.bio || ''}
              onChange={(e) => handleInputChange('bio', e.target.value)}
              placeholder="Conte um pouco sobre você e sua experiência profissional..."
              rows={4}
            />
          ) : (
            <p className="p-3 bg-gray-50 rounded-md min-h-[100px]">
              {profile.bio || 'Nenhuma biografia adicionada'}
            </p>
          )}
        </div>

        {isEditing && (
          <div className="flex gap-2 pt-4">
            <Button onClick={handleSave} disabled={saving}>
              {saving ? 'Salvando...' : 'Salvar Alterações'}
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setIsEditing(false);
                loadProfile(); // Recarregar dados originais
              }}
            >
              Cancelar
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}