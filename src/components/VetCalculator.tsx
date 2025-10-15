"use client";

import { useState, useEffect } from 'react';
import { Calculator, Stethoscope, Heart, Droplets, Clock, Baby, Scale, Activity, Syringe, Pill, Zap, LogOut, Save, Upload } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface VetCalculatorProps {
  onLogout?: () => void;
}

export default function VetCalculator({ onLogout }: VetCalculatorProps) {
  // Estados para cálculo de medicamentos
  const [medWeight, setMedWeight] = useState('');
  const [medDose, setMedDose] = useState('');
  const [medConcentration, setMedConcentration] = useState('');
  const [medType, setMedType] = useState('injectable');
  const [medUnit, setMedUnit] = useState('mg/ml');
  const [medResult, setMedResult] = useState('');

  // Estados para UI - Nova seção baseada nas imagens
  const [uiWeight, setUiWeight] = useState('');
  const [uiDose, setUiDose] = useState('');
  const [uiConcentration, setUiConcentration] = useState('');
  const [uiUnit, setUiUnit] = useState('UI/mL');
  const [uiResult, setUiResult] = useState('');

  // Estados para fluidoterapia - Melhorados baseados nas imagens
  const [fluidAnimal, setFluidAnimal] = useState('');
  const [fluidWeight, setFluidWeight] = useState('');
  const [fluidDehydration, setFluidDehydration] = useState('');
  const [fluidLossType, setFluidLossType] = useState('');
  const [fluidEquipType, setFluidEquipType] = useState('');
  const [fluidMaintenance, setFluidMaintenance] = useState('60');
  const [fluidHours, setFluidHours] = useState('24');
  const [fluidResults, setFluidResults] = useState({
    reposition: 0,
    maintenance: 0,
    losses: 0,
    total24h: 0,
    totalPerHour: 0,
    dropsPerMin: 0,
    dropsPer10Sec: 0
  });

  // Estados para velocidade de infusão
  const [infusionVolume, setInfusionVolume] = useState('');
  const [infusionTime, setInfusionTime] = useState('');
  const [dropFactor, setDropFactor] = useState('20');
  const [infusionResult, setInfusionResult] = useState('');

  // Estados para transfusão sanguínea - Reformulados para as 4 abas
  // Aba 1 - Cálculo transfusão cães
  const [dogRecipientWeight, setDogRecipientWeight] = useState('');
  const [dogCurrentHct, setDogCurrentHct] = useState('');
  const [dogTargetHct, setDogTargetHct] = useState('');
  const [dogTransfusionResult, setDogTransfusionResult] = useState('');

  // Aba 2 - Limite doador cães
  const [dogDonorWeight, setDogDonorWeight] = useState('');
  const [dogTransfusionVolume, setDogTransfusionVolume] = useState('');
  const [dogDonorResult, setDogDonorResult] = useState('');

  // Aba 3 - Cálculo transfusão gatos
  const [catRecipientWeight, setCatRecipientWeight] = useState('');
  const [catCurrentHct, setCatCurrentHct] = useState('');
  const [catTargetHct, setCatTargetHct] = useState('');
  const [catTransfusionResult, setCatTransfusionResult] = useState('');

  // Aba 4 - Limite doador gatos
  const [catDonorWeight, setCatDonorWeight] = useState('');
  const [catTransfusionVolume, setCatTransfusionVolume] = useState('');
  const [catDonorResult, setCatDonorResult] = useState('');

  // Estados para TVT Vincristina - Reformulado para peso x dose
  const [tvtWeight, setTvtWeight] = useState('');
  const [tvtResult, setTvtResult] = useState('');

  // Estados para idade gestacional - Reformulados baseados no HTML fornecido
  const [gestSpecies, setGestSpecies] = useState('');
  const [gestCategory, setGestCategory] = useState('');
  const [gestPhase, setGestPhase] = useState('');
  const [gestMeasurement, setGestMeasurement] = useState('');
  const [gestResult, setGestResult] = useState('');

  // Estados para conversor de unidades
  const [convertValue, setConvertValue] = useState('');
  const [convertFrom, setConvertFrom] = useState('kg');
  const [convertTo, setConvertTo] = useState('g');
  const [convertResult, setConvertResult] = useState('');

  // Estados para Apgar
  const [apgarHeart, setApgarHeart] = useState('');
  const [apgarResp, setApgarResp] = useState('');
  const [apgarReflex, setApgarReflex] = useState('');
  const [apgarMuscle, setApgarMuscle] = useState('');
  const [apgarColor, setApgarColor] = useState('');
  const [apgarResult, setApgarResult] = useState('');

  // Estados para medicamentos injetáveis
  const [injWeight, setInjWeight] = useState('');
  const [injDose, setInjDose] = useState('');
  const [injConcentration, setInjConcentration] = useState('');
  const [injRoute, setInjRoute] = useState('iv');
  const [injResult, setInjResult] = useState('');

  // Estados para anestésicos - Nova implementação completa
  const [anesthSpecies, setAnesthSpecies] = useState('dog');
  const [anesthCategory, setAnesthCategory] = useState('');
  const [anesthDrug, setAnesthDrug] = useState('');
  const [anesthWeight, setAnesthWeight] = useState('');
  const [anesthConcentration, setAnesthConcentration] = useState('');
  const [anesthResult, setAnesthResult] = useState('');

  // Estados para funcionalidade de salvar/carregar
  const [saveStatus, setSaveStatus] = useState('');
  const [loadStatus, setLoadStatus] = useState('');

  // Função para sair da calculadora - CORRIGIDA
  const handleLogout = () => {
    // Confirmar se o usuário quer sair
    const confirmLogout = window.confirm('Deseja sair da calculadora? Todos os dados serão perdidos.');
    
    if (confirmLogout) {
      // Executar logout IMEDIATAMENTE se confirmado
      if (onLogout) {
        onLogout();
      }
    }
  };

  // Função para salvar projeto
  const saveProject = () => {
    try {
      const projectData = {
        // Medicamentos
        medWeight,
        medDose,
        medConcentration,
        medType,
        medUnit,
        
        // UI
        uiWeight,
        uiDose,
        uiConcentration,
        uiUnit,
        
        // Fluidoterapia
        fluidAnimal,
        fluidWeight,
        fluidDehydration,
        fluidLossType,
        fluidEquipType,
        fluidMaintenance,
        fluidHours,
        
        // Infusão
        infusionVolume,
        infusionTime,
        dropFactor,
        
        // Transfusão - Cães
        dogRecipientWeight,
        dogCurrentHct,
        dogTargetHct,
        dogDonorWeight,
        dogTransfusionVolume,
        
        // Transfusão - Gatos
        catRecipientWeight,
        catCurrentHct,
        catTargetHct,
        catDonorWeight,
        catTransfusionVolume,
        
        // TVT
        tvtWeight,
        
        // Gestacional
        gestSpecies,
        gestCategory,
        gestPhase,
        gestMeasurement,
        
        // Conversor
        convertValue,
        convertFrom,
        convertTo,
        
        // Apgar
        apgarHeart,
        apgarResp,
        apgarReflex,
        apgarMuscle,
        apgarColor,
        
        // Injetáveis
        injWeight,
        injDose,
        injConcentration,
        injRoute,
        
        // Anestésicos
        anesthSpecies,
        anesthCategory,
        anesthDrug,
        anesthWeight,
        anesthConcentration,
        
        // Timestamp
        savedAt: new Date().toISOString()
      };

      localStorage.setItem('vetCalculatorProject', JSON.stringify(projectData));
      setSaveStatus('✅ Projeto salvo com sucesso!');
      
      // Limpar mensagem após 3 segundos
      setTimeout(() => setSaveStatus(''), 3000);
    } catch (error) {
      setSaveStatus('❌ Erro ao salvar projeto');
      setTimeout(() => setSaveStatus(''), 3000);
    }
  };

  // Função para carregar projeto
  const loadProject = () => {
    try {
      const savedData = localStorage.getItem('vetCalculatorProject');
      
      if (!savedData) {
        setLoadStatus('⚠️ Nenhum projeto salvo encontrado');
        setTimeout(() => setLoadStatus(''), 3000);
        return;
      }

      const projectData = JSON.parse(savedData);
      
      // Confirmar se o usuário quer carregar (vai sobrescrever dados atuais)
      const confirmLoad = window.confirm('Carregar projeto salvo? Isso irá substituir todos os dados atuais.');
      
      if (!confirmLoad) return;

      // Restaurar todos os estados
      setMedWeight(projectData.medWeight || '');
      setMedDose(projectData.medDose || '');
      setMedConcentration(projectData.medConcentration || '');
      setMedType(projectData.medType || 'injectable');
      setMedUnit(projectData.medUnit || 'mg/ml');
      
      setUiWeight(projectData.uiWeight || '');
      setUiDose(projectData.uiDose || '');
      setUiConcentration(projectData.uiConcentration || '');
      setUiUnit(projectData.uiUnit || 'UI/mL');
      
      setFluidAnimal(projectData.fluidAnimal || '');
      setFluidWeight(projectData.fluidWeight || '');
      setFluidDehydration(projectData.fluidDehydration || '');
      setFluidLossType(projectData.fluidLossType || '');
      setFluidEquipType(projectData.fluidEquipType || '');
      setFluidMaintenance(projectData.fluidMaintenance || '60');
      setFluidHours(projectData.fluidHours || '24');
      
      setInfusionVolume(projectData.infusionVolume || '');
      setInfusionTime(projectData.infusionTime || '');
      setDropFactor(projectData.dropFactor || '20');
      
      setDogRecipientWeight(projectData.dogRecipientWeight || '');
      setDogCurrentHct(projectData.dogCurrentHct || '');
      setDogTargetHct(projectData.dogTargetHct || '');
      setDogDonorWeight(projectData.dogDonorWeight || '');
      setDogTransfusionVolume(projectData.dogTransfusionVolume || '');
      
      setCatRecipientWeight(projectData.catRecipientWeight || '');
      setCatCurrentHct(projectData.catCurrentHct || '');
      setCatTargetHct(projectData.catTargetHct || '');
      setCatDonorWeight(projectData.catDonorWeight || '');
      setCatTransfusionVolume(projectData.catTransfusionVolume || '');
      
      setTvtWeight(projectData.tvtWeight || '');
      
      setGestSpecies(projectData.gestSpecies || '');
      setGestCategory(projectData.gestCategory || '');
      setGestPhase(projectData.gestPhase || '');
      setGestMeasurement(projectData.gestMeasurement || '');
      
      setConvertValue(projectData.convertValue || '');
      setConvertFrom(projectData.convertFrom || 'kg');
      setConvertTo(projectData.convertTo || 'g');
      
      setApgarHeart(projectData.apgarHeart || '');
      setApgarResp(projectData.apgarResp || '');
      setApgarReflex(projectData.apgarReflex || '');
      setApgarMuscle(projectData.apgarMuscle || '');
      setApgarColor(projectData.apgarColor || '');
      
      setInjWeight(projectData.injWeight || '');
      setInjDose(projectData.injDose || '');
      setInjConcentration(projectData.injConcentration || '');
      setInjRoute(projectData.injRoute || 'iv');
      
      setAnesthSpecies(projectData.anesthSpecies || 'dog');
      setAnesthCategory(projectData.anesthCategory || '');
      setAnesthDrug(projectData.anesthDrug || '');
      setAnesthWeight(projectData.anesthWeight || '');
      setAnesthConcentration(projectData.anesthConcentration || '');

      // Limpar resultados (serão recalculados se necessário)
      setMedResult('');
      setUiResult('');
      setFluidResults({
        reposition: 0,
        maintenance: 0,
        losses: 0,
        total24h: 0,
        totalPerHour: 0,
        dropsPerMin: 0,
        dropsPer10Sec: 0
      });
      setInfusionResult('');
      setDogTransfusionResult('');
      setDogDonorResult('');
      setCatTransfusionResult('');
      setCatDonorResult('');
      setTvtResult('');
      setGestResult('');
      setConvertResult('');
      setApgarResult('');
      setInjResult('');
      setAnesthResult('');

      const savedDate = new Date(projectData.savedAt).toLocaleString('pt-BR');
      setLoadStatus(`✅ Projeto carregado! (Salvo em: ${savedDate})`);
      
      // Limpar mensagem após 5 segundos
      setTimeout(() => setLoadStatus(''), 5000);
    } catch (error) {
      setLoadStatus('❌ Erro ao carregar projeto');
      setTimeout(() => setLoadStatus(''), 3000);
    }
  };

  // Base de dados completa de anestésicos baseada na tabela fornecida - ATUALIZADA
  const anestheticDrugs = {
    sedatives: {
      name: "🧘‍♂️ Sedativos / Tranquilizantes / Alfa-2 / Benzodiazepínicos",
      drugs: [
        {
          id: 'acepromazina',
          name: 'Acepromazina',
          species: ['dog', 'cat'],
          dose: { min: 0.03, max: 0.2 },
          via: 'IM/IV',
          obs: 'Início: IM 5-10min, IV 2-3min. Duração: IV 40-50min, IM 60-120min. Concentração: 2mg/mL ou 10mg/mL.',
          concentration: [2, 10] // mg/mL
        },
        {
          id: 'clorpromazina',
          name: 'Clorpromazina',
          species: ['dog', 'cat'],
          dose: { min: 0.25, max: 1.0 },
          via: 'IM/IV',
          obs: 'Início: IM 5-10min, IV 2-3min. Duração: IM >120min, IV 60-80min. Concentração: 5mg/mL.',
          concentration: [5] // mg/mL
        },
        {
          id: 'levomepromazina',
          name: 'Levomepromazina',
          species: ['dog', 'cat'],
          dose: { min: 0.25, max: 1.0 },
          via: 'IM/IV',
          obs: 'Início: IM 5-10min, IV 2-3min. Duração: IM >120min, IV 60-80min. Concentração: 5mg/mL.',
          concentration: [5] // mg/mL
        },
        {
          id: 'diazepam',
          name: 'Diazepam',
          species: ['dog', 'cat'],
          dose: { min: 0.25, max: 1.0 },
          via: 'IV',
          obs: 'Início: <1min. Duração: 2-3h. Concentração: 5mg/mL. Antídoto: flumazenil.',
          concentration: [5] // mg/mL
        },
        {
          id: 'midazolam',
          name: 'Midazolam',
          species: ['dog', 'cat'],
          dose: { min: 0.25, max: 1.0 },
          via: 'IM/IV',
          obs: 'Início: <1min. Duração: 1-2,5h. Concentração: 5mg/mL ou 1mg/mL. Antídoto: flumazenil 0.005-0.05mg/kg.',
          concentration: [1, 5] // mg/mL
        },
        {
          id: 'xilazina',
          name: 'Xilazina',
          species: ['dog'],
          dose: { min: 0.5, max: 0.8 },
          via: 'IM',
          obs: 'Início: 10-15min. Duração: 1-2h (até 4h). Concentração: 2mg/mL. Antídoto: ioimbina 0,4-2mg/kg.',
          concentration: [2] // mg/mL (corrigido de 20 para 2)
        },
        {
          id: 'dexmedetomidina',
          name: 'Dexmedetomidina',
          species: ['dog', 'cat'],
          dose: { min: 0.001, max: 0.01 },
          via: 'IM/IV',
          obs: 'Início: 1-10min. Infusão: 0,5-2µg/kg/hr. Concentração: 0,5mg/mL. Antídoto: atipamezole.',
          concentration: [0.5] // mg/mL
        },
        {
          id: 'detomidina',
          name: 'Detomidina',
          species: ['dog', 'cat'],
          dose: { min: 0.02, max: 0.04 },
          via: 'IV',
          obs: 'Início: 3-5min. Duração: 50-60min. Concentração: 10mg/mL.',
          concentration: [10] // mg/mL
        }
      ]
    },
    opioids: {
      name: "💉 Opioides",
      drugs: [
        {
          id: 'morfina',
          name: 'Morfina',
          species: ['dog', 'cat'],
          dose: { min: 0.5, max: 1.0 },
          via: 'IM/IV',
          obs: 'Início: IM ~5min, IV 2-3min. Duração: 3-4h. Concentração: 10mg/mL ou 1mg/mL. Infusão: 0,1-0,3mg/kg/hr.',
          concentration: [1, 10] // mg/mL
        },
        {
          id: 'metadona',
          name: 'Metadona',
          species: ['dog', 'cat'],
          dose: { min: 0.1, max: 0.5 },
          via: 'IM/IV',
          obs: 'Início: IM ~5min, IV 2-3min. Duração: 3-4h. Concentração: 10mg/mL. Antídoto: naloxona.',
          concentration: [10] // mg/mL
        },
        {
          id: 'tramadol',
          name: 'Tramadol',
          species: ['dog', 'cat'],
          dose: { min: 2, max: 6 },
          via: 'IM/IV',
          obs: 'Início: IM ~5min, IV 2-3min. Duração: 4-8h. Concentração: 50mg/mL.',
          concentration: [50] // mg/mL
        },
        {
          id: 'meperidina',
          name: 'Meperidina (pethidine)',
          species: ['dog', 'cat'],
          dose: { min: 5, max: 5 },
          via: 'IM',
          obs: 'Início: ~5min. Duração: 1-2h. Concentração: 50mg/mL. Antídoto: naloxona.',
          concentration: [50] // mg/mL
        },
        {
          id: 'fentanil',
          name: 'Fentanil',
          species: ['dog', 'cat'],
          dose: { min: 0.002, max: 0.005 },
          via: 'IV',
          obs: 'Início: <1min, efeito máximo 3-4min. Duração bolus: 15-20min. Concentração: 0,05mg/mL. Antídoto: naloxona.',
          concentration: [0.05] // mg/mL
        },
        {
          id: 'sufentanil',
          name: 'Sufentanil',
          species: ['dog', 'cat'],
          dose: { min: 0.001, max: 0.001 },
          via: 'IV',
          obs: 'Início: <1min, efeito máximo 3-5min. Duração bolus: 30-40min. Concentração: 50µg/mL ou 5µg/mL.',
          concentration: [0.005, 0.05] // mg/mL (convertido de µg/mL)
        },
        {
          id: 'remifentanil',
          name: 'Remifentanil',
          species: ['dog', 'cat'],
          dose: { min: 0.0001, max: 0.0003 },
          via: 'IV',
          obs: 'Infusão: 0,1-0,3µg/kg/min. Início: <1min. Duração: enquanto em infusão. Concentração: 0,1mg/mL.',
          concentration: [0.1] // mg/mL
        }
      ]
    },
    dissociatives: {
      name: "🌈 Dissociativos / Hipnóticos",
      drugs: [
        {
          id: 'cetamina',
          name: 'Cetamina',
          species: ['dog', 'cat'],
          dose: { min: 0.6, max: 10 },
          via: 'IM/IV',
          obs: 'Início: segundos-min. Duração variável. Concentração: 100mg/mL. Associar com sedativo.',
          concentration: [100] // mg/mL
        },
        {
          id: 'zoletil',
          name: 'Zoletil (Tiletamina+Zolazepam)',
          species: ['dog', 'cat'],
          dose: { min: 2, max: 5 },
          via: 'IM/IV',
          obs: 'Indução rápida. Duração variável. Concentração: 50mg/mL.',
          concentration: [50] // mg/mL
        },
        {
          id: 'propofol',
          name: 'Propofol',
          species: ['dog', 'cat'],
          dose: { min: 2, max: 10 },
          via: 'IV',
          obs: 'Início: 10-15s, quase imediato. Duração: 15-20min. Concentração: 10mg/mL.',
          concentration: [10] // mg/mL
        }
      ]
    },
    locals: {
      name: "🔬 Anestésicos Locais",
      drugs: [
        {
          id: 'lidocaina',
          name: 'Lidocaína 2%',
          species: ['dog', 'cat'],
          dose: { min: 2, max: 3 },
          via: 'IV',
          obs: 'Dose mínima: 2mg/kg, Dose máxima: 3mg/kg. Concentração: 20mg/mL. Infusão: 30-50 µg/kg/min. Início: 1-2min. Duração: 15-20min.',
          concentration: [20] // mg/mL
        },
        {
          id: 'sulfato_magnesio',
          name: 'Sulfato de Magnésio',
          species: ['dog', 'cat'],
          dose: { min: 20, max: 30 },
          via: 'IV',
          obs: 'Bolus lento: 20-30mg/kg. Infusão: 1,33-2,66mg/kg/min. Início: 2-5min. Concentração: 100mg/mL.',
          concentration: [100] // mg/mL
        }
      ]
    },
    antagonists: {
      name: "🔄 Antagonistas / Reversores",
      drugs: [
        {
          id: 'atipamezol',
          name: 'Atipamezol',
          species: ['dog', 'cat'],
          dose: { min: 0.05, max: 0.1 },
          via: 'IM/IV',
          obs: 'Reversor de alfa-2 agonistas (dexmedetomidina).',
          concentration: [1] // mg/mL (estimado)
        },
        {
          id: 'naloxona',
          name: 'Naloxona',
          species: ['dog', 'cat'],
          dose: { min: 0.04, max: 0.04 },
          via: 'IM/IV',
          obs: 'Reversor de opioides.',
          concentration: [0.4] // mg/mL (estimado)
        },
        {
          id: 'flumazenil',
          name: 'Flumazenil',
          species: ['dog', 'cat'],
          dose: { min: 0.005, max: 0.05 },
          via: 'IV',
          obs: 'Reversor de benzodiazepínicos.',
          concentration: [0.1] // mg/mL (estimado)
        }
      ]
    }
  };

  // Função para cálculo de medicamentos
  const calculateMedication = () => {
    const weight = parseFloat(medWeight);
    const dose = parseFloat(medDose);
    const concentration = parseFloat(medConcentration);

    if (!weight || !dose || !concentration) {
      setMedResult('Por favor, preencha todos os campos');
      return;
    }

    let totalDose = weight * dose; // mg total
    let volume = 0;
    let unit = '';

    switch (medType) {
      case 'injectable':
        switch (medUnit) {
          case 'mg/ml':
            volume = totalDose / concentration;
            unit = 'mL';
            break;
          case 'mcg/ml':
            volume = (totalDose * 1000) / concentration; // converter mg para mcg
            unit = 'mL';
            break;
          case 'g/ml':
            volume = totalDose / (concentration * 1000); // converter mg para g
            unit = 'mL';
            break;
          case 'percent':
            // Para porcentagem: 1% = 10mg/mL
            const mgPerMl = concentration * 10;
            volume = totalDose / mgPerMl;
            unit = 'mL';
            break;
        }
        break;
      case 'tablet':
        switch (medUnit) {
          case 'mg':
            volume = totalDose / concentration;
            unit = 'comprimidos';
            break;
          case 'g':
            volume = totalDose / (concentration * 1000);
            unit = 'comprimidos';
            break;
        }
        break;
      case 'oral':
        switch (medUnit) {
          case 'mg/drop':
            volume = totalDose / concentration;
            unit = 'gotas';
            break;
          case 'mg/ml':
            volume = totalDose / concentration;
            unit = 'mL';
            break;
        }
        break;
      case 'reconstitution':
        switch (medUnit) {
          case 'mg':
            volume = totalDose / concentration;
            unit = 'mL (após reconstituição)';
            break;
          case 'mcg':
            volume = (totalDose * 1000) / concentration;
            unit = 'mL (após reconstituição)';
            break;
          case 'g':
            volume = totalDose / (concentration * 1000);
            unit = 'mL (após reconstituição)';
            break;
        }
        break;
    }

    setMedResult(`Dose total: ${totalDose.toFixed(2)} mg\nVolume/Quantidade: ${volume.toFixed(2)} ${unit}`);
  };

  // Função para cálculo de UI - Nova implementação baseada nas imagens
  const calculateUI = () => {
    const weight = parseFloat(uiWeight);
    const dose = parseFloat(uiDose);
    const concentration = parseFloat(uiConcentration);

    if (!weight || !dose || !concentration) {
      setUiResult('Por favor, preencha todos os campos');
      return;
    }

    const totalUI = weight * dose; // UI total necessária
    let volume = 0;
    let unit = '';

    switch (uiUnit) {
      case 'UI/mL':
        volume = totalUI / concentration;
        unit = 'mL';
        break;
      case 'UI/mg':
        volume = totalUI / concentration;
        unit = 'mg';
        break;
      case 'UI/mcg':
        volume = totalUI / concentration;
        unit = 'mcg';
        break;
    }

    setUiResult(`Dose total: ${totalUI.toFixed(0)} UI\nVolume/Quantidade: ${volume.toFixed(2)} ${unit}`);
  };

  // Função para limpar campos UI
  const clearUI = () => {
    setUiWeight('');
    setUiDose('');
    setUiConcentration('');
    setUiResult('');
  };

  // Função para cálculo de fluidoterapia - Modificada conforme solicitação
  const calculateFluidotherapy = () => {
    const weight = parseFloat(fluidWeight);
    const maintenance = parseFloat(fluidMaintenance);
    const dehydration = parseFloat(fluidDehydration) || 0;
    const hours = parseFloat(fluidHours);

    if (!weight || !hours) {
      setFluidResults({
        reposition: 0,
        maintenance: 0,
        losses: 0,
        total24h: 0,
        totalPerHour: 0,
        dropsPerMin: 0,
        dropsPer10Sec: 0
      });
      return;
    }

    // Cálculos baseados no tipo de animal
    let maintenanceRate = maintenance;
    if (fluidAnimal === 'young_dog') {
      maintenanceRate = 100;
    } else if (fluidAnimal === 'adult_dog') {
      maintenanceRate = weight <= 10 ? 100 : weight <= 25 ? 75 : 60;
    } else if (fluidAnimal === 'senior_dog') {
      maintenanceRate = 50;
    } else if (fluidAnimal === 'cat') {
      maintenanceRate = 60;
    }

    const maintenanceVol = weight * maintenanceRate;
    const dehydrationVol = weight * (dehydration / 100) * 1000;
    
    // Cálculo das perdas contínuas baseado no tipo
    let ongoingVol = 0;
    if (fluidLossType && fluidLossType !== 'none') {
      switch (fluidLossType) {
        case 'vomiting':
          ongoingVol = weight * 2; // 2 mL/kg/dia
          break;
        case 'diarrhea':
          ongoingVol = weight * 5; // 5 mL/kg/dia
          break;
        case 'vomiting_diarrhea':
          ongoingVol = weight * 7; // 7 mL/kg/dia
          break;
        case 'polyuria':
          ongoingVol = weight * 10; // 10 mL/kg/dia
          break;
        case 'drainage':
          ongoingVol = weight * 3; // 3 mL/kg/dia
          break;
        case 'other':
          ongoingVol = weight * 2; // 2 mL/kg/dia
          break;
      }
    }

    // Total SEM perdas contínuas (conforme solicitado)
    const totalVolume24h = maintenanceVol + dehydrationVol;
    const hourlyRate = totalVolume24h / hours;

    // Cálculo de gotas por minuto baseado no tipo de equipo
    let dropFactor = 20; // padrão
    if (fluidEquipType === 'macrogotas') {
      dropFactor = 20;
    } else if (fluidEquipType === 'microgotas') {
      dropFactor = 60;
    }

    const dropsPerMin = (hourlyRate * dropFactor) / 60;
    const dropsPer10Sec = dropsPerMin / 6;

    setFluidResults({
      reposition: Math.round(dehydrationVol),
      maintenance: Math.round(maintenanceVol),
      losses: Math.round(ongoingVol),
      total24h: Math.round(totalVolume24h),
      totalPerHour: Math.round(hourlyRate * 10) / 10,
      dropsPerMin: Math.round(dropsPerMin),
      dropsPer10Sec: Math.round(dropsPer10Sec)
    });
  };

  // Função para limpar campos de fluidoterapia
  const clearFluidotherapy = () => {
    setFluidAnimal('');
    setFluidWeight('');
    setFluidDehydration('');
    setFluidLossType('');
    setFluidEquipType('');
    setFluidResults({
      reposition: 0,
      maintenance: 0,
      losses: 0,
      total24h: 0,
      totalPerHour: 0,
      dropsPerMin: 0,
      dropsPer10Sec: 0
    });
  };

  // Função para velocidade de infusão
  const calculateInfusionRate = () => {
    const volume = parseFloat(infusionVolume);
    const time = parseFloat(infusionTime);
    const factor = parseFloat(dropFactor);

    if (!volume || !time) {
      setInfusionResult('Por favor, preencha volume e tempo');
      return;
    }

    const mlPerHour = volume / time;
    const dropsPerMinute = (volume * factor) / (time * 60);

    setInfusionResult(`Taxa de infusão: ${mlPerHour.toFixed(1)} mL/h\nGotas por minuto: ${dropsPerMinute.toFixed(0)} gts/min`);
  };

  // Funções para transfusão sanguínea - Reformuladas para as 4 abas

  // Aba 1 - Cálculo transfusão cães
  const calculateDogTransfusion = () => {
    const weight = parseFloat(dogRecipientWeight);
    const currentHct = parseFloat(dogCurrentHct);
    const targetHct = parseFloat(dogTargetHct);

    if (!weight || !currentHct || !targetHct) {
      setDogTransfusionResult('Por favor, preencha todos os campos');
      return;
    }

    // Volume sanguíneo total para cães: 90 mL/kg
    const bloodVolume = weight * 90;
    
    // Fórmula: Volume = (Peso × 90 × (Hct desejado - Hct atual)) / Hct do doador
    // Assumindo Hct do doador = 45%
    const donorHct = 45;
    const volumeNeeded = (weight * 90 * (targetHct - currentHct)) / donorHct;
    
    // Proporção de anticoagulante (1:7 a 1:9)
    const anticoagulantMin = volumeNeeded / 8; // 1:7
    const anticoagulantMax = volumeNeeded / 10; // 1:9

    setDogTransfusionResult(
      `Volume sanguíneo total: ${bloodVolume.toFixed(0)} mL\n` +
      `Volume a transfundir: ${volumeNeeded.toFixed(0)} mL\n` +
      `Anticoagulante (1:7 a 1:9): ${anticoagulantMin.toFixed(1)} - ${anticoagulantMax.toFixed(1)} mL\n` +
      `Fórmula: (Peso × 90 × (Hct desejado - Hct atual)) / 45`
    );
  };

  // Aba 2 - Limite doador cães
  const calculateDogDonorLimit = () => {
    const weight = parseFloat(dogDonorWeight);
    const volume = parseFloat(dogTransfusionVolume);

    if (!weight || !volume) {
      setDogDonorResult('Por favor, preencha todos os campos');
      return;
    }

    // Limites para cães: 16-18 mL/kg
    const minSafe = weight * 16;
    const maxSafe = weight * 18;
    const volumePerKg = volume / weight;

    let status = '';
    let alertLevel = '';

    if (volume < minSafe) {
      status = 'Volume abaixo do mínimo recomendado';
      alertLevel = 'warning';
    } else if (volume > maxSafe) {
      status = 'ATENÇÃO: Volume acima do limite seguro!';
      alertLevel = 'danger';
    } else {
      status = 'Volume dentro dos limites seguros';
      alertLevel = 'safe';
    }

    setDogDonorResult(
      `Volume por kg: ${volumePerKg.toFixed(1)} mL/kg\n` +
      `Limite mínimo: ${minSafe.toFixed(0)} mL (16 mL/kg)\n` +
      `Limite máximo: ${maxSafe.toFixed(0)} mL (18 mL/kg)\n` +
      `Status: ${status}`
    );
  };

  // Aba 3 - Cálculo transfusão gatos
  const calculateCatTransfusion = () => {
    const weight = parseFloat(catRecipientWeight);
    const currentHct = parseFloat(catCurrentHct);
    const targetHct = parseFloat(catTargetHct);

    if (!weight || !currentHct || !targetHct) {
      setCatTransfusionResult('Por favor, preencha todos os campos');
      return;
    }

    // Volume sanguíneo total para gatos: 70 mL/kg
    const bloodVolume = weight * 70;
    
    // Fórmula: Volume = (Peso × 70 × (Hct desejado - Hct atual)) / Hct do doador
    // Assumindo Hct do doador = 45%
    const donorHct = 45;
    const volumeNeeded = (weight * 70 * (targetHct - currentHct)) / donorHct;
    
    // Proporção de anticoagulante (1:7 a 1:9)
    const anticoagulantMin = volumeNeeded / 8; // 1:7
    const anticoagulantMax = volumeNeeded / 10; // 1:9

    setCatTransfusionResult(
      `Volume sanguíneo total: ${bloodVolume.toFixed(0)} mL\n` +
      `Volume a transfundir: ${volumeNeeded.toFixed(0)} mL\n` +
      `Anticoagulante (1:7 a 1:9): ${anticoagulantMin.toFixed(1)} - ${anticoagulantMax.toFixed(1)} mL\n` +
      `Fórmula: (Peso × 70 × (Hct desejado - Hct atual)) / 45`
    );
  };

  // Aba 4 - Limite doador gatos
  const calculateCatDonorLimit = () => {
    const weight = parseFloat(catDonorWeight);
    const volume = parseFloat(catTransfusionVolume);

    if (!weight || !volume) {
      setCatDonorResult('Por favor, preencha todos os campos');
      return;
    }

    // Limites para gatos: 11-13 mL/kg
    const minSafe = weight * 11;
    const maxSafe = weight * 13;
    const volumePerKg = volume / weight;

    let status = '';
    let alertLevel = '';

    if (volume < minSafe) {
      status = 'Volume abaixo do mínimo recomendado';
      alertLevel = 'warning';
    } else if (volume > maxSafe) {
      status = 'ATENÇÃO: Volume acima do limite seguro!';
      alertLevel = 'danger';
    } else {
      status = 'Volume dentro dos limites seguros';
      alertLevel = 'safe';
    }

    setCatDonorResult(
      `Volume por kg: ${volumePerKg.toFixed(1)} mL/kg\n` +
      `Limite mínimo: ${minSafe.toFixed(0)} mL (11 mL/kg)\n` +
      `Limite máximo: ${maxSafe.toFixed(0)} mL (13 mL/kg)\n` +
      `Status: ${status}`
    );
  };

  // Função para TVT Vincristina - Nova implementação peso x dose
  const calculateTVTVincristina = () => {
    const weight = parseFloat(tvtWeight);

    if (!weight) {
      setTvtResult('Por favor, preencha o peso do animal');
      return;
    }

    // Cálculo das doses mínima e máxima
    const doseMinima = weight * 0.025; // mL
    const doseMaxima = weight * 0.125; // mL

    setTvtResult(
      `Peso do animal: ${weight} kg\n\n` +
      `💉 Dose MÍNIMA: ${doseMinima.toFixed(3)} mL\n` +
      `💉 Dose MÁXIMA: ${doseMaxima.toFixed(3)} mL\n\n` +
      `Fórmula utilizada:\n` +
      `• Dose mínima = Peso × 0.025 mL\n` +
      `• Dose máxima = Peso × 0.125 mL\n\n` +
      `⚠️ Administrar por via intravenosa lentamente`
    );
  };

  // Função para atualizar opções de categoria baseada na espécie - Baseada no HTML fornecido
  const updateGestationalOptions = (species: string) => {
    setGestSpecies(species);
    setGestCategory(''); // Reset category when species changes
  };

  // Função para idade gestacional - Reformulada baseada no HTML fornecido
  const calculateGestationalAge = () => {
    const medida = parseFloat(gestMeasurement);
    
    if (!gestSpecies || !gestPhase || isNaN(medida)) {
      setGestResult('⚠️ Preencha todos os campos corretamente.');
      return;
    }

    let dias: number | null = null;
    let texto = '';

    // === FASE ANTES DOS 35 DIAS ===
    if (gestPhase === 'antes') {
      if (gestSpecies === 'cadela') {
        if (gestCategory === 'toy_até_5_kg') dias = (0.62887 * medida) - 44.04;
        else if (gestCategory === 'pequena') dias = (medida - 68.68) / 1.53;
        else if (gestCategory === 'média_e_grande') dias = (medida - 82.13) / 1.8;
      }
      if (gestSpecies === 'gata') {
        dias = (medida - 62.03) / 1.1;
      }

      // Fórmula CRL geral
      if (!dias) {
        dias = (3 * medida) + 27;
        texto = 'Idade gestacional estimada (em dias):';
      } else {
        texto = 'Estimativa de dias para o parto:';
      }
    }

    // === FASE DEPOIS DOS 35 DIAS ===
    if (gestPhase === 'depois') {
      if (gestSpecies === 'cadela') {
        if (gestCategory === 'toy_até_5_kg') dias = (1.6190 * medida) - 39.7;
        else if (gestCategory === 'pequena') dias = (medida - 25.11) / 0.61;
        else if (gestCategory === 'média_e_grande') dias = (medida - 29.18) / 0.7;
      }
      if (gestSpecies === 'gata') {
        dias = (medida - 23.39) / 0.47;
      }
      texto = 'Estimativa de dias para o parto:';
    }

    if (dias !== null) {
      setGestResult(`${texto}\n🐾 ${dias.toFixed(1)} dias`);
    } else {
      setGestResult('⚠️ Não há fórmula disponível para esta combinação.');
    }
  };

  // Função para conversor de unidades
  const convertUnits = () => {
    const value = parseFloat(convertValue);
    if (!value) {
      setConvertResult('Por favor, insira um valor');
      return;
    }

    const conversions = {
      // Peso
      'kg-g': (v: number) => v * 1000,
      'g-kg': (v: number) => v / 1000,
      'kg-lb': (v: number) => v * 2.20462,
      'lb-kg': (v: number) => v / 2.20462,
      'g-mg': (v: number) => v * 1000,
      'mg-g': (v: number) => v / 1000,
      'mg-mcg': (v: number) => v * 1000,
      'mcg-mg': (v: number) => v / 1000,
      
      // Volume
      'l-ml': (v: number) => v * 1000,
      'ml-l': (v: number) => v / 1000,
      'ml-drops': (v: number) => v * 20, // 20 gotas/mL padrão
      'drops-ml': (v: number) => v / 20,
      
      // Temperatura
      'c-f': (v: number) => (v * 9/5) + 32,
      'f-c': (v: number) => (v - 32) * 5/9,
    };

    const key = `${convertFrom}-${convertTo}`;
    const converter = conversions[key as keyof typeof conversions];
    
    if (converter) {
      const result = converter(value);
      setConvertResult(`${value} ${convertFrom} = ${result.toFixed(4)} ${convertTo}`);
    } else {
      setConvertResult('Conversão não disponível');
    }
  };

  // Função para Apgar
  const calculateApgar = () => {
    const heart = parseInt(apgarHeart) || 0;
    const resp = parseInt(apgarResp) || 0;
    const reflex = parseInt(apgarReflex) || 0;
    const muscle = parseInt(apgarMuscle) || 0;
    const color = parseInt(apgarColor) || 0;

    const total = heart + resp + reflex + muscle + color;
    
    let status = '';
    if (total >= 7) {
      status = 'Bom (≥7)';
    } else if (total >= 4) {
      status = 'Moderado (4-6)';
    } else {
      status = 'Crítico (<4)';
    }

    setApgarResult(`Escore Apgar: ${total}/10\nStatus: ${status}\n\nFreq. cardíaca: ${heart}\nRespiração: ${resp}\nReflexos: ${reflex}\nTônus muscular: ${muscle}\nColoração: ${color}`);
  };

  // Função para medicamentos injetáveis
  const calculateInjectable = () => {
    const weight = parseFloat(injWeight);
    const dose = parseFloat(injDose);
    const concentration = parseFloat(injConcentration);

    if (!weight || !dose || !concentration) {
      setInjResult('Por favor, preencha todos os campos');
      return;
    }

    const totalDose = weight * dose;
    const volume = totalDose / concentration;
    
    let route = '';
    switch (injRoute) {
      case 'iv': route = 'Intravenosa'; break;
      case 'im': route = 'Intramuscular'; break;
      case 'sc': route = 'Subcutânea'; break;
      case 'ip': route = 'Intraperitoneal'; break;
    }

    setInjResult(`Dose total: ${totalDose.toFixed(2)} mg\nVolume: ${volume.toFixed(2)} mL\nVia: ${route}\n\nObservação: Verificar compatibilidade da via com o medicamento`);
  };

  // Função para filtrar medicamentos por categoria e espécie
  const getFilteredDrugs = () => {
    if (!anesthCategory) return [];
    
    const categoryData = anestheticDrugs[anesthCategory as keyof typeof anestheticDrugs];
    if (!categoryData) return [];
    
    return categoryData.drugs.filter(drug => drug.species.includes(anesthSpecies));
  };

  // Função para calcular dose de anestésicos com concentração - CORRIGIDA
  const calculateAnesthetic = () => {
    const weight = parseFloat(anesthWeight);
    const concentration = parseFloat(anesthConcentration);
    
    if (!anesthDrug || !weight) {
      setAnesthResult('Por favor, selecione um medicamento e informe o peso');
      return;
    }

    // Encontrar o medicamento selecionado
    let selectedDrug = null;
    for (const category of Object.values(anestheticDrugs)) {
      selectedDrug = category.drugs.find(drug => drug.id === anesthDrug);
      if (selectedDrug) break;
    }

    if (!selectedDrug) {
      setAnesthResult('Medicamento não encontrado');
      return;
    }

    // Calcular doses em mg
    const minDose = selectedDrug.dose.min * weight;
    const maxDose = selectedDrug.dose.max * weight;

    let result = `💊 MEDICAMENTO: ${selectedDrug.name}\n`;
    result += `🐕 ESPÉCIE: ${anesthSpecies === 'dog' ? 'Cão' : 'Gato'}\n`;
    result += `⚖️ PESO: ${weight} kg\n\n`;
    
    result += `💉 DOSE CALCULADA (mg):\n`;
    if (selectedDrug.dose.min === selectedDrug.dose.max) {
      result += `• ${minDose} mg\n`;
    } else {
      result += `• ${minDose} - ${maxDose} mg\n`;
    }

    // Calcular volume se concentração foi fornecida
    if (concentration && concentration > 0) {
      const minVolume = minDose / concentration;
      const maxVolume = maxDose / concentration;
      
      result += `\n💧 VOLUME CALCULADO (mL):\n`;
      if (selectedDrug.dose.min === selectedDrug.dose.max) {
        result += `• ${minVolume.toFixed(2)} mL\n`;
      } else {
        result += `• ${minVolume.toFixed(2)} - ${maxVolume.toFixed(2)} mL\n`;
      }
      result += `(Baseado na concentração: ${concentration} mg/mL)\n`;
    }
    
    result += `\n🎯 VIA DE ADMINISTRAÇÃO:\n• ${selectedDrug.via}\n`;
    result += `\n⚠️ OBSERVAÇÕES:\n• ${selectedDrug.obs}`;

    // Adicionar conversão para microgramas se necessário
    if (selectedDrug.dose.min < 0.1) {
      const minDoseUg = minDose * 1000;
      const maxDoseUg = maxDose * 1000;
      result += `\n\n🔬 CONVERSÃO (µg):\n`;
      if (selectedDrug.dose.min === selectedDrug.dose.max) {
        result += `• ${minDoseUg.toFixed(1)} µg`;
      } else {
        result += `• ${minDoseUg.toFixed(1)} - ${maxDoseUg.toFixed(1)} µg`;
      }
    }

    setAnesthResult(result);
  };

  // Função para limpar campos de anestésicos
  const clearAnesthetics = () => {
    setAnesthCategory('');
    setAnesthDrug('');
    setAnesthWeight('');
    setAnesthConcentration('');
    setAnesthResult('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-3 rounded-full">
              <Stethoscope className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Calculadora Vet de Bolso
            </h1>
            {/* Botões de controle */}
            <div className="flex gap-2 ml-4">
              {/* Botão Salvar Projeto */}
              <Button
                onClick={saveProject}
                variant="outline"
                size="sm"
                className="bg-green-50 border-green-300 text-green-700 hover:bg-green-100 hover:border-green-400 shadow-sm px-4 py-2 rounded-lg transition-all duration-200"
              >
                <Save className="w-4 h-4 mr-2" />
                Salvar
              </Button>
              
              {/* Botão Carregar Projeto */}
              <Button
                onClick={loadProject}
                variant="outline"
                size="sm"
                className="bg-blue-50 border-blue-300 text-blue-700 hover:bg-blue-100 hover:border-blue-400 shadow-sm px-4 py-2 rounded-lg transition-all duration-200"
              >
                <Upload className="w-4 h-4 mr-2" />
                Carregar
              </Button>
              
              {/* Botão de Sair */}
              <Button
                onClick={handleLogout}
                variant="outline"
                size="sm"
                className="bg-white border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 shadow-sm px-4 py-2 rounded-lg transition-all duration-200"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sair
              </Button>
            </div>
          </div>
          <p className="text-gray-600 text-lg">
            Ferramenta completa para cálculos veterinários essenciais
          </p>
          
          {/* Status de Salvar/Carregar */}
          {(saveStatus || loadStatus) && (
            <div className="mt-4">
              {saveStatus && (
                <div className="inline-block bg-green-100 border border-green-300 text-green-800 px-4 py-2 rounded-lg mr-2">
                  {saveStatus}
                </div>
              )}
              {loadStatus && (
                <div className="inline-block bg-blue-100 border border-blue-300 text-blue-800 px-4 py-2 rounded-lg">
                  {loadStatus}
                </div>
              )}
            </div>
          )}
        </div>

        <Tabs defaultValue="medication" className="w-full">
          <TabsList className="grid w-full grid-cols-5 lg:grid-cols-10 mb-8">
            <TabsTrigger value="medication" className="text-xs">
              <Pill className="w-4 h-4 mr-1" />
              Medicamentos
            </TabsTrigger>
            <TabsTrigger value="ui" className="text-xs bg-orange-100 data-[state=active]:bg-orange-500 data-[state=active]:text-white hover:bg-orange-200">
              <Syringe className="w-4 h-4 mr-1" />
              UI
            </TabsTrigger>
            <TabsTrigger value="fluid" className="text-xs">
              <Droplets className="w-4 h-4 mr-1" />
              Fluidoterapia
            </TabsTrigger>
            <TabsTrigger value="infusion" className="text-xs">
              <Clock className="w-4 h-4 mr-1" />
              Infusão
            </TabsTrigger>
            <TabsTrigger value="transfusion" className="text-xs">
              <Heart className="w-4 h-4 mr-1" />
              Transfusão
            </TabsTrigger>
            <TabsTrigger value="tvt" className="text-xs">
              <Syringe className="w-4 h-4 mr-1" />
              TVT Vincristina
            </TabsTrigger>
            <TabsTrigger value="gestational" className="text-xs">
              <Baby className="w-4 h-4 mr-1" />
              Gestacional
            </TabsTrigger>
            <TabsTrigger value="converter" className="text-xs">
              <Calculator className="w-4 h-4 mr-1" />
              Conversor
            </TabsTrigger>
            <TabsTrigger value="apgar" className="text-xs">
              <Activity className="w-4 h-4 mr-1" />
              Apgar
            </TabsTrigger>
            <TabsTrigger value="anesthetics" className="text-xs">
              <Zap className="w-4 h-4 mr-1" />
              Anestésicos
            </TabsTrigger>
          </TabsList>

          {/* Cálculo de Medicamentos */}
          <TabsContent value="medication">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Pill className="w-5 h-5" />
                  Cálculo de Medicamentos
                </CardTitle>
                <CardDescription>
                  Calcule doses precisas para medicamentos veterinários
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="medWeight">Peso do Animal (kg)</Label>
                    <Input
                      id="medWeight"
                      type="number"
                      value={medWeight}
                      onChange={(e) => setMedWeight(e.target.value)}
                      placeholder="Ex: 25"
                    />
                  </div>
                  <div>
                    <Label htmlFor="medDose">Dose (mg/kg)</Label>
                    <Input
                      id="medDose"
                      type="number"
                      value={medDose}
                      onChange={(e) => setMedDose(e.target.value)}
                      placeholder="Ex: 10"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="medConcentration">Concentração</Label>
                    <Input
                      id="medConcentration"
                      type="number"
                      value={medConcentration}
                      onChange={(e) => setMedConcentration(e.target.value)}
                      placeholder="Ex: 50"
                    />
                  </div>
                  <div>
                    <Label htmlFor="medType">Tipo de Medicamento</Label>
                    <Select value={medType} onValueChange={setMedType}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="injectable">Injetável</SelectItem>
                        <SelectItem value="tablet">Comprimido</SelectItem>
                        <SelectItem value="oral">Solução Oral</SelectItem>
                        <SelectItem value="reconstitution">Reconstituição</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="medUnit">Unidade de Concentração</Label>
                  <Select value={medUnit} onValueChange={setMedUnit}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mg/ml">mg/mL</SelectItem>
                      <SelectItem value="mcg/ml">mcg/mL</SelectItem>
                      <SelectItem value="g/ml">g/mL</SelectItem>
                      <SelectItem value="percent">% (porcentagem)</SelectItem>
                      <SelectItem value="mg">mg (comprimidos)</SelectItem>
                      <SelectItem value="g">g (comprimidos)</SelectItem>
                      <SelectItem value="mg/drop">mg/gota</SelectItem>
                      <SelectItem value="mcg">mcg (reconstituição)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button onClick={calculateMedication} className="w-full">
                  Calcular Medicamento
                </Button>

                {medResult && (
                  <Alert>
                    <Calculator className="h-4 w-4" />
                    <AlertDescription className="whitespace-pre-line">
                      {medResult}
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Cálculo de UI - Nova seção baseada nas imagens */}
          <TabsContent value="ui">
            <div className="max-w-md mx-auto">
              <Card className="bg-white shadow-lg rounded-2xl border-0">
                <CardHeader className="text-center pb-6">
                  <CardTitle className="text-2xl font-bold text-gray-800">
                    Cálculos de Medicamentos em UI
                  </CardTitle>
                  <CardDescription className="text-gray-600">
                    Calcule doses de medicamentos em Unidades Internacionais
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 px-8 pb-8">
                  {/* Peso do Animal */}
                  <div className="space-y-2">
                    <Label htmlFor="uiWeight" className="text-sm font-medium text-gray-700">
                      Peso do Animal (kg)
                    </Label>
                    <Input
                      id="uiWeight"
                      type="number"
                      value={uiWeight}
                      onChange={(e) => setUiWeight(e.target.value)}
                      placeholder="Digite o peso em kg"
                      className="h-12 border-gray-300 rounded-lg focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
                    />
                  </div>

                  {/* Dose do Medicamento */}
                  <div className="space-y-2">
                    <Label htmlFor="uiDose" className="text-sm font-medium text-gray-700">
                      Dose do Medicamento (UI/kg)
                    </Label>
                    <Input
                      id="uiDose"
                      type="number"
                      value={uiDose}
                      onChange={(e) => setUiDose(e.target.value)}
                      placeholder="Digite a dose em UI/kg"
                      className="h-12 border-gray-300 rounded-lg focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
                    />
                  </div>

                  {/* Concentração */}
                  <div className="space-y-2">
                    <Label htmlFor="uiConcentration" className="text-sm font-medium text-gray-700">
                      Concentração
                    </Label>
                    <Input
                      id="uiConcentration"
                      type="number"
                      value={uiConcentration}
                      onChange={(e) => setUiConcentration(e.target.value)}
                      placeholder="Digite a concentração"
                      className="h-12 border-gray-300 rounded-lg focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
                    />
                  </div>

                  {/* Unidade de Concentração */}
                  <div className="space-y-2">
                    <Label htmlFor="uiUnit" className="text-sm font-medium text-gray-700">
                      Unidade de Concentração
                    </Label>
                    <Select value={uiUnit} onValueChange={setUiUnit}>
                      <SelectTrigger className="h-12 border-gray-300 rounded-lg focus:border-blue-400">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="UI/mL">UI/mL</SelectItem>
                        <SelectItem value="UI/mg">UI/mg</SelectItem>
                        <SelectItem value="UI/mcg">UI/mcg</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Botões */}
                  <div className="flex gap-3 pt-4">
                    <Button 
                      onClick={calculateUI} 
                      className="flex-1 h-12 bg-black hover:bg-gray-800 text-white rounded-lg font-medium transition-all"
                    >
                      Calcular
                    </Button>
                    <Button 
                      onClick={clearUI}
                      variant="outline" 
                      className="flex-1 h-12 border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-all"
                    >
                      Limpar
                    </Button>
                  </div>

                  {/* Resultado */}
                  {uiResult && (
                    <Alert className="mt-6 border-blue-200 bg-blue-50">
                      <Calculator className="h-4 w-4 text-blue-600" />
                      <AlertDescription className="whitespace-pre-line text-blue-800 font-medium">
                        {uiResult}
                      </AlertDescription>
                    </Alert>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Fluidoterapia - Interface melhorada baseada nas imagens */}
          <TabsContent value="fluid">
            <div className="max-w-4xl mx-auto">
              <Card className="bg-white shadow-lg rounded-2xl border-0">
                <CardHeader className="text-center pb-6">
                  <CardTitle className="text-2xl font-bold text-gray-800 flex items-center justify-center gap-2">
                    <Droplets className="w-6 h-6 text-blue-600" />
                    Cálculo de Fluidoterapia
                  </CardTitle>
                  <CardDescription className="text-gray-600">
                    Calcule necessidades de fluidos para manutenção, desidratação e perdas
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 px-8 pb-8">
                  {/* Campos de entrada */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Tipo de Animal */}
                    <div className="space-y-2">
                      <Label htmlFor="fluidAnimal" className="text-sm font-medium text-gray-700">
                        Tipo de Animal
                      </Label>
                      <Select value={fluidAnimal} onValueChange={setFluidAnimal}>
                        <SelectTrigger className="h-12 border-gray-300 rounded-lg focus:border-blue-400">
                          <SelectValue placeholder="Selecione o tipo de animal" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="young_dog">Cão Jovem</SelectItem>
                          <SelectItem value="adult_dog">Cão Adulto</SelectItem>
                          <SelectItem value="senior_dog">Cão Idoso</SelectItem>
                          <SelectItem value="cat">Gato</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Peso do Animal */}
                    <div className="space-y-2">
                      <Label htmlFor="fluidWeight" className="text-sm font-medium text-gray-700">
                        Peso do Animal (kg)
                      </Label>
                      <Input
                        id="fluidWeight"
                        type="number"
                        value={fluidWeight}
                        onChange={(e) => setFluidWeight(e.target.value)}
                        placeholder="Digite o peso em kg"
                        className="h-12 border-gray-300 rounded-lg focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
                      />
                    </div>

                    {/* Grau de Desidratação */}
                    <div className="space-y-2">
                      <Label htmlFor="fluidDehydration" className="text-sm font-medium text-gray-700">
                        Grau de Desidratação (%)
                      </Label>
                      <Input
                        id="fluidDehydration"
                        type="number"
                        value={fluidDehydration}
                        onChange={(e) => setFluidDehydration(e.target.value)}
                        placeholder="Ex: 5"
                        className="h-12 border-gray-300 rounded-lg focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
                      />
                    </div>

                    {/* Tipo de Perdas Contínuas */}
                    <div className="space-y-2">
                      <Label htmlFor="fluidLossType" className="text-sm font-medium text-gray-700">
                        Tipo de Perdas Contínuas
                      </Label>
                      <Select value={fluidLossType} onValueChange={setFluidLossType}>
                        <SelectTrigger className="h-12 border-gray-300 rounded-lg focus:border-blue-400">
                          <SelectValue placeholder="Selecione o tipo de perda" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="vomiting">Vômito</SelectItem>
                          <SelectItem value="diarrhea">Diarreia</SelectItem>
                          <SelectItem value="vomiting_diarrhea">Vômito e Diarreia</SelectItem>
                          <SelectItem value="polyuria">Poliúria</SelectItem>
                          <SelectItem value="drainage">Drenagem</SelectItem>
                          <SelectItem value="other">Outras</SelectItem>
                          <SelectItem value="none">Nenhuma</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Tipo de Equipo */}
                    <div className="space-y-2">
                      <Label htmlFor="fluidEquipType" className="text-sm font-medium text-gray-700">
                        Tipo de Equipo
                      </Label>
                      <Select value={fluidEquipType} onValueChange={setFluidEquipType}>
                        <SelectTrigger className="h-12 border-gray-300 rounded-lg focus:border-blue-400">
                          <SelectValue placeholder="Selecione o tipo de equipo" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="macrogotas">Macrogotas</SelectItem>
                          <SelectItem value="microgotas">Microgotas</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Período de Administração */}
                    <div className="space-y-2">
                      <Label htmlFor="fluidHours" className="text-sm font-medium text-gray-700">
                        Período de Administração (horas)
                      </Label>
                      <Input
                        id="fluidHours"
                        type="number"
                        value={fluidHours}
                        onChange={(e) => setFluidHours(e.target.value)}
                        placeholder="24"
                        className="h-12 border-gray-300 rounded-lg focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
                      />
                    </div>
                  </div>

                  {/* Botões */}
                  <div className="flex gap-3 pt-4">
                    <Button 
                      onClick={calculateFluidotherapy} 
                      className="flex-1 h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-all"
                    >
                      Calcular
                    </Button>
                    <Button 
                      onClick={clearFluidotherapy}
                      variant="outline" 
                      className="flex-1 h-12 border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-all"
                    >
                      Limpar
                    </Button>
                  </div>

                  {/* Resultados em formato de caixas - baseado na imagem */}
                  {(fluidResults.reposition > 0 || fluidResults.maintenance > 0) && (
                    <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* Reposição */}
                      <div className="border-2 border-black p-4 rounded-lg bg-white">
                        <div className="text-center">
                          <div className="font-bold text-lg mb-2">Reposição</div>
                          <div className="text-2xl font-bold text-blue-600">
                            {fluidResults.reposition} mL
                          </div>
                        </div>
                      </div>

                      {/* Manutenção */}
                      <div className="border-2 border-black p-4 rounded-lg bg-white">
                        <div className="text-center">
                          <div className="font-bold text-lg mb-2">Manutenção</div>
                          <div className="text-2xl font-bold text-green-600">
                            {fluidResults.maintenance} mL
                          </div>
                        </div>
                      </div>

                      {/* Perdas Contínuas */}
                      <div className="border-2 border-black p-4 rounded-lg bg-white">
                        <div className="text-center">
                          <div className="font-bold text-lg mb-2">Perdas Contínuas</div>
                          <div className="text-2xl font-bold text-orange-600">
                            {fluidResults.losses} mL
                          </div>
                        </div>
                      </div>

                      {/* Total em 24h */}
                      <div className="border-2 border-black p-4 rounded-lg bg-white">
                        <div className="text-center">
                          <div className="font-bold text-lg mb-2">Total em 24h</div>
                          <div className="text-2xl font-bold text-purple-600">
                            {fluidResults.total24h} mL
                          </div>
                        </div>
                      </div>

                      {/* Total mL/hr */}
                      <div className="border-2 border-black p-4 rounded-lg bg-white">
                        <div className="text-center">
                          <div className="font-bold text-lg mb-2">Total mL/hr</div>
                          <div className="text-2xl font-bold text-red-600">
                            {fluidResults.totalPerHour} mL/hr
                          </div>
                        </div>
                      </div>

                      {/* Infusão */}
                      <div className="border-2 border-black p-4 rounded-lg bg-white">
                        <div className="text-center">
                          <div className="font-bold text-lg mb-2">Infusão</div>
                          <div className="text-lg font-bold text-indigo-600">
                            {fluidResults.dropsPerMin} gotas/min
                          </div>
                          <div className="text-sm font-bold text-indigo-600 mt-1">
                            {fluidResults.dropsPer10Sec} gotas/10 seg
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Velocidade de Infusão */}
          <TabsContent value="infusion">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Cálculo de Velocidade de Infusão
                </CardTitle>
                <CardDescription>
                  Calcule taxa de infusão em mL/h e gotas por minuto
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="infusionVolume">Volume Total (mL)</Label>
                    <Input
                      id="infusionVolume"
                      type="number"
                      value={infusionVolume}
                      onChange={(e) => setInfusionVolume(e.target.value)}
                      placeholder="Ex: 500"
                    />
                  </div>
                  <div>
                    <Label htmlFor="infusionTime">Tempo (horas)</Label>
                    <Input
                      id="infusionTime"
                      type="number"
                      value={infusionTime}
                      onChange={(e) => setInfusionTime(e.target.value)}
                      placeholder="Ex: 8"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="dropFactor">Fator de Gotejamento (gts/mL)</Label>
                  <Select value={dropFactor} onValueChange={setDropFactor}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="10">10 gts/mL (Macrogotas)</SelectItem>
                      <SelectItem value="15">15 gts/mL</SelectItem>
                      <SelectItem value="20">20 gts/mL (Padrão)</SelectItem>
                      <SelectItem value="60">60 gts/mL (Microgotas)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button onClick={calculateInfusionRate} className="w-full">
                  Calcular Velocidade
                </Button>

                {infusionResult && (
                  <Alert>
                    <Calculator className="h-4 w-4" />
                    <AlertDescription className="whitespace-pre-line">
                      {infusionResult}
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Transfusão Sanguínea - Nova estrutura com 4 abas */}
          <TabsContent value="transfusion">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="w-5 h-5" />
                  Cálculo de Transfusão Sanguínea
                </CardTitle>
                <CardDescription>
                  Calcule volumes e limites seguros para transfusão sanguínea
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="dog-calc" className="w-full">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="dog-calc">Cálculo Cães</TabsTrigger>
                    <TabsTrigger value="dog-donor">Limite Doador Cães</TabsTrigger>
                    <TabsTrigger value="cat-calc">Cálculo Gatos</TabsTrigger>
                    <TabsTrigger value="cat-donor">Limite Doador Gatos</TabsTrigger>
                  </TabsList>

                  {/* Aba 1 - Cálculo transfusão cães */}
                  <TabsContent value="dog-calc" className="space-y-4">
                    <div className="bg-blue-50 p-4 rounded-lg mb-4">
                      <h4 className="font-semibold text-blue-800 mb-2">Cálculo de Transfusão para Cães</h4>
                      <p className="text-sm text-blue-700">Volume sanguíneo total: 90 mL/kg</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="dogRecipientWeight">Peso do Receptor (kg)</Label>
                        <Input
                          id="dogRecipientWeight"
                          type="number"
                          value={dogRecipientWeight}
                          onChange={(e) => setDogRecipientWeight(e.target.value)}
                          placeholder="Ex: 25"
                        />
                      </div>
                      <div>
                        <Label htmlFor="dogCurrentHct">Hematócrito Atual (%)</Label>
                        <Input
                          id="dogCurrentHct"
                          type="number"
                          value={dogCurrentHct}
                          onChange={(e) => setDogCurrentHct(e.target.value)}
                          placeholder="Ex: 15"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="dogTargetHct">Hematócrito Desejado (%)</Label>
                      <Input
                        id="dogTargetHct"
                        type="number"
                        value={dogTargetHct}
                        onChange={(e) => setDogTargetHct(e.target.value)}
                        placeholder="Ex: 25"
                      />
                    </div>

                    <Button onClick={calculateDogTransfusion} className="w-full">
                      Calcular Volume de Transfusão
                    </Button>

                    {dogTransfusionResult && (
                      <Alert>
                        <Calculator className="h-4 w-4" />
                        <AlertDescription className="whitespace-pre-line">
                          {dogTransfusionResult}
                        </AlertDescription>
                      </Alert>
                    )}

                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h5 className="font-semibold mb-2">Informações Importantes:</h5>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• Proporção anticoagulante: 1:7 a 1:9</li>
                        <li>• Taxa de infusão: 0,25-1 mL/kg/h</li>
                        <li>• Monitorar sinais vitais durante transfusão</li>
                      </ul>
                    </div>
                  </TabsContent>

                  {/* Aba 2 - Limite doador cães */}
                  <TabsContent value="dog-donor" className="space-y-4">
                    <div className="bg-orange-50 p-4 rounded-lg mb-4">
                      <h4 className="font-semibold text-orange-800 mb-2">Limite Seguro para Doador Canino</h4>
                      <p className="text-sm text-orange-700">Limite: 16-18 mL/kg</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="dogDonorWeight">Peso do Doador (kg)</Label>
                        <Input
                          id="dogDonorWeight"
                          type="number"
                          value={dogDonorWeight}
                          onChange={(e) => setDogDonorWeight(e.target.value)}
                          placeholder="Ex: 30"
                        />
                      </div>
                      <div>
                        <Label htmlFor="dogTransfusionVolume">Volume Calculado para Transfusão (mL)</Label>
                        <Input
                          id="dogTransfusionVolume"
                          type="number"
                          value={dogTransfusionVolume}
                          onChange={(e) => setDogTransfusionVolume(e.target.value)}
                          placeholder="Ex: 450"
                        />
                      </div>
                    </div>

                    <Button onClick={calculateDogDonorLimit} className="w-full">
                      Verificar Limite do Doador
                    </Button>

                    {dogDonorResult && (
                      <Alert>
                        <Calculator className="h-4 w-4" />
                        <AlertDescription className="whitespace-pre-line">
                          {dogDonorResult}
                        </AlertDescription>
                      </Alert>
                    )}

                    <div className="bg-red-50 p-4 rounded-lg">
                      <h5 className="font-semibold text-red-800 mb-2">⚠️ Alerta de Segurança:</h5>
                      <ul className="text-sm text-red-700 space-y-1">
                        <li>• Nunca exceder 18 mL/kg do doador</li>
                        <li>• Doador deve estar saudável e bem hidratado</li>
                        <li>• Monitorar sinais vitais do doador</li>
                        <li>• Intervalo mínimo entre doações: 3-4 semanas</li>
                      </ul>
                    </div>
                  </TabsContent>

                  {/* Aba 3 - Cálculo transfusão gatos */}
                  <TabsContent value="cat-calc" className="space-y-4">
                    <div className="bg-green-50 p-4 rounded-lg mb-4">
                      <h4 className="font-semibold text-green-800 mb-2">Cálculo de Transfusão para Gatos</h4>
                      <p className="text-sm text-green-700">Volume sanguíneo total: 70 mL/kg</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="catRecipientWeight">Peso do Receptor (kg)</Label>
                        <Input
                          id="catRecipientWeight"
                          type="number"
                          value={catRecipientWeight}
                          onChange={(e) => setCatRecipientWeight(e.target.value)}
                          placeholder="Ex: 4"
                        />
                      </div>
                      <div>
                        <Label htmlFor="catCurrentHct">Hematócrito Atual (%)</Label>
                        <Input
                          id="catCurrentHct"
                          type="number"
                          value={catCurrentHct}
                          onChange={(e) => setCatCurrentHct(e.target.value)}
                          placeholder="Ex: 12"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="catTargetHct">Hematócrito Desejado (%)</Label>
                      <Input
                        id="catTargetHct"
                        type="number"
                        value={catTargetHct}
                        onChange={(e) => setCatTargetHct(e.target.value)}
                        placeholder="Ex: 20"
                      />
                    </div>

                    <Button onClick={calculateCatTransfusion} className="w-full">
                      Calcular Volume de Transfusão
                    </Button>

                    {catTransfusionResult && (
                      <Alert>
                        <Calculator className="h-4 w-4" />
                        <AlertDescription className="whitespace-pre-line">
                          {catTransfusionResult}
                        </AlertDescription>
                      </Alert>
                    )}

                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h5 className="font-semibold mb-2">Informações Importantes:</h5>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• Proporção anticoagulante: 1:7 a 1:9</li>
                        <li>• Taxa de infusão: 0,25-0,5 mL/kg/h (mais lenta que cães)</li>
                        <li>• Tipagem sanguínea obrigatória em gatos</li>
                        <li>• Maior risco de reações transfusionais</li>
                      </ul>
                    </div>
                  </TabsContent>

                  {/* Aba 4 - Limite doador gatos */}
                  <TabsContent value="cat-donor" className="space-y-4">
                    <div className="bg-purple-50 p-4 rounded-lg mb-4">
                      <h4 className="font-semibold text-purple-800 mb-2">Limite Seguro para Doador Felino</h4>
                      <p className="text-sm text-purple-700">Limite: 11-13 mL/kg</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="catDonorWeight">Peso do Doador (kg)</Label>
                        <Input
                          id="catDonorWeight"
                          type="number"
                          value={catDonorWeight}
                          onChange={(e) => setCatDonorWeight(e.target.value)}
                          placeholder="Ex: 5"
                        />
                      </div>
                      <div>
                        <Label htmlFor="catTransfusionVolume">Volume Calculado para Transfusão (mL)</Label>
                        <Input
                          id="catTransfusionVolume"
                          type="number"
                          value={catTransfusionVolume}
                          onChange={(e) => setCatTransfusionVolume(e.target.value)}
                          placeholder="Ex: 50"
                        />
                      </div>
                    </div>

                    <Button onClick={calculateCatDonorLimit} className="w-full">
                      Verificar Limite do Doador
                    </Button>

                    {catDonorResult && (
                      <Alert>
                        <Calculator className="h-4 w-4" />
                        <AlertDescription className="whitespace-pre-line">
                          {catDonorResult}
                        </AlertDescription>
                      </Alert>
                    )}

                    <div className="bg-red-50 p-4 rounded-lg">
                      <h5 className="font-semibold text-red-800 mb-2">⚠️ Alerta de Segurança:</h5>
                      <ul className="text-sm text-red-700 space-y-1">
                        <li>• Nunca exceder 13 mL/kg do doador</li>
                        <li>• Gatos são mais sensíveis à perda sanguínea</li>
                        <li>• Tipagem sanguínea obrigatória (A, B, AB)</li>
                        <li>• Intervalo mínimo entre doações: 6-8 semanas</li>
                        <li>• Doador deve pesar no mínimo 4,5 kg</li>
                      </ul>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </TabsContent>

          {/* TVT Vincristina - Nova calculadora peso x dose */}
          <TabsContent value="tvt">
            <div className="max-w-md mx-auto">
              <Card className="bg-white shadow-lg rounded-2xl border-0">
                <CardHeader className="text-center pb-6">
                  <CardTitle className="text-2xl font-bold text-gray-800 flex items-center justify-center gap-2">
                    <Syringe className="w-6 h-6 text-purple-600" />
                    TVT Vincristina
                  </CardTitle>
                  <CardDescription className="text-gray-600">
                    Calculadora de dose mínima e máxima para TVT
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 px-8 pb-8">
                  {/* Peso do Animal */}
                  <div className="space-y-2">
                    <Label htmlFor="tvtWeight" className="text-sm font-medium text-gray-700">
                      Peso do Animal (kg)
                    </Label>
                    <Input
                      id="tvtWeight"
                      type="number"
                      value={tvtWeight}
                      onChange={(e) => setTvtWeight(e.target.value)}
                      placeholder="Digite o peso em kg"
                      className="h-12 border-gray-300 rounded-lg focus:border-purple-400 focus:ring-2 focus:ring-purple-100 transition-all"
                    />
                  </div>

                  {/* Botão Calcular */}
                  <Button 
                    onClick={calculateTVTVincristina} 
                    className="w-full h-12 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-all"
                  >
                    Calcular Doses
                  </Button>

                  {/* Resultado */}
                  {tvtResult && (
                    <Alert className="mt-6 border-purple-200 bg-purple-50">
                      <Syringe className="h-4 w-4 text-purple-600" />
                      <AlertDescription className="whitespace-pre-line text-purple-800 font-medium">
                        {tvtResult}
                      </AlertDescription>
                    </Alert>
                  )}

                  {/* Informações importantes */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h5 className="font-semibold mb-2 text-gray-800">📋 Informações Importantes:</h5>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Dose mínima: 0.025 mL/kg</li>
                      <li>• Dose máxima: 0.125 mL/kg</li>
                      <li>• Administração intravenosa lenta</li>
                      <li>• Monitorar reações adversas</li>
                      <li>• Usar equipamentos de proteção</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Idade Gestacional - Reformulada baseada no HTML fornecido */}
          <TabsContent value="gestational">
            <div className="max-w-2xl mx-auto">
              <Card className="bg-white shadow-lg rounded-2xl border-0">
                <CardHeader className="text-center pb-6">
                  <CardTitle className="text-2xl font-bold text-[#0099a8] flex items-center justify-center gap-2">
                    <Baby className="w-6 h-6" />
                    Calculadora Gestacional
                  </CardTitle>
                  <CardDescription className="text-gray-600">
                    Cadelas e Gatas - Cálculo de Idade Gestacional
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 px-8 pb-8">
                  {/* Espécie */}
                  <div className="space-y-2">
                    <Label htmlFor="gestSpecies" className="text-sm font-medium text-gray-700">
                      Espécie:
                    </Label>
                    <Select value={gestSpecies} onValueChange={updateGestationalOptions}>
                      <SelectTrigger className="h-12 border-gray-300 rounded-lg focus:border-[#0099a8]">
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cadela">Cadela</SelectItem>
                        <SelectItem value="gata">Gata</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Categoria */}
                  <div className="space-y-2">
                    <Label htmlFor="gestCategory" className="text-sm font-medium text-gray-700">
                      Categoria:
                    </Label>
                    <Select value={gestCategory} onValueChange={setGestCategory}>
                      <SelectTrigger className="h-12 border-gray-300 rounded-lg focus:border-[#0099a8]">
                        <SelectValue placeholder={gestSpecies ? "Selecione a categoria" : "Selecione a espécie primeiro"} />
                      </SelectTrigger>
                      <SelectContent>
                        {gestSpecies === 'cadela' && (
                          <>
                            <SelectItem value="toy_até_5_kg">Toy até 5 kg</SelectItem>
                            <SelectItem value="pequena">Pequena</SelectItem>
                            <SelectItem value="média_e_grande">Média e grande</SelectItem>
                          </>
                        )}
                        {gestSpecies === 'gata' && (
                          <>
                            <SelectItem value="gata_comum">Gata comum</SelectItem>
                          </>
                        )}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Fase Gestacional */}
                  <div className="space-y-2">
                    <Label htmlFor="gestPhase" className="text-sm font-medium text-gray-700">
                      Fase Gestacional:
                    </Label>
                    <Select value={gestPhase} onValueChange={setGestPhase}>
                      <SelectTrigger className="h-12 border-gray-300 rounded-lg focus:border-[#0099a8]">
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="antes">Antes dos 35 dias</SelectItem>
                        <SelectItem value="depois">Depois dos 35 dias</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Medida */}
                  <div className="space-y-2">
                    <Label htmlFor="gestMeasurement" className="text-sm font-medium text-gray-700">
                      Medida (mm):
                    </Label>
                    <Input
                      id="gestMeasurement"
                      type="number"
                      step="0.01"
                      value={gestMeasurement}
                      onChange={(e) => setGestMeasurement(e.target.value)}
                      placeholder="Insira a medida (CRL, vesícula ou DB)"
                      className="h-12 border-gray-300 rounded-lg focus:border-[#0099a8] focus:ring-2 focus:ring-[#0099a8]/20 transition-all"
                    />
                  </div>

                  {/* Botão Calcular */}
                  <Button 
                    onClick={calculateGestationalAge} 
                    className="w-full h-12 bg-[#0099a8] hover:bg-[#007b88] text-white rounded-lg font-bold transition-all"
                  >
                    Calcular
                  </Button>

                  {/* Resultado */}
                  {gestResult && (
                    <div className="mt-6 bg-[#e8f9fb] border-l-4 border-[#0099a8] p-4 rounded-lg">
                      <div className="text-lg font-medium text-gray-800 whitespace-pre-line">
                        {gestResult}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Conversor de Unidades */}
          <TabsContent value="converter">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="w-5 h-5" />
                  Conversor de Unidades
                </CardTitle>
                <CardDescription>
                  Converta entre diferentes unidades de medida
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="convertValue">Valor</Label>
                  <Input
                    id="convertValue"
                    type="number"
                    value={convertValue}
                    onChange={(e) => setConvertValue(e.target.value)}
                    placeholder="Ex: 5.5"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="convertFrom">De</Label>
                    <Select value={convertFrom} onValueChange={setConvertFrom}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="kg">Quilograma (kg)</SelectItem>
                        <SelectItem value="g">Grama (g)</SelectItem>
                        <SelectItem value="mg">Miligrama (mg)</SelectItem>
                        <SelectItem value="mcg">Micrograma (mcg)</SelectItem>
                        <SelectItem value="lb">Libra (lb)</SelectItem>
                        <SelectItem value="l">Litro (L)</SelectItem>
                        <SelectItem value="ml">Mililitro (mL)</SelectItem>
                        <SelectItem value="drops">Gotas</SelectItem>
                        <SelectItem value="c">Celsius (°C)</SelectItem>
                        <SelectItem value="f">Fahrenheit (°F)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="convertTo">Para</Label>
                    <Select value={convertTo} onValueChange={setConvertTo}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="kg">Quilograma (kg)</SelectItem>
                        <SelectItem value="g">Grama (g)</SelectItem>
                        <SelectItem value="mg">Miligrama (mg)</SelectItem>
                        <SelectItem value="mcg">Micrograma (mcg)</SelectItem>
                        <SelectItem value="lb">Libra (lb)</SelectItem>
                        <SelectItem value="l">Litro (L)</SelectItem>
                        <SelectItem value="ml">Mililitro (mL)</SelectItem>
                        <SelectItem value="drops">Gotas</SelectItem>
                        <SelectItem value="c">Celsius (°C)</SelectItem>
                        <SelectItem value="f">Fahrenheit (°F)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button onClick={convertUnits} className="w-full">
                  Converter
                </Button>

                {convertResult && (
                  <Alert>
                    <Calculator className="h-4 w-4" />
                    <AlertDescription>{convertResult}</AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Escore Apgar */}
          <TabsContent value="apgar">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  Cálculo de Escore Apgar Neonatal
                </CardTitle>
                <CardDescription>
                  Avalie a vitalidade de neonatos através do escore Apgar
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="apgarHeart">Frequência Cardíaca (0-2)</Label>
                    <Select value={apgarHeart} onValueChange={setApgarHeart}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0">0 - Ausente</SelectItem>
                        <SelectItem value="1">1 - &lt; 100 bpm</SelectItem>
                        <SelectItem value="2">2 - &gt; 100 bpm</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="apgarResp">Respiração (0-2)</Label>
                    <Select value={apgarResp} onValueChange={setApgarResp}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0">0 - Ausente</SelectItem>
                        <SelectItem value="1">1 - Irregular/fraca</SelectItem>
                        <SelectItem value="2">2 - Regular/forte</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="apgarReflex">Reflexos (0-2)</Label>
                    <Select value={apgarReflex} onValueChange={setApgarReflex}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0">0 - Ausente</SelectItem>
                        <SelectItem value="1">1 - Diminuído</SelectItem>
                        <SelectItem value="2">2 - Normal</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="apgarMuscle">Tônus Muscular (0-2)</Label>
                    <Select value={apgarMuscle} onValueChange={setApgarMuscle}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0">0 - Flácido</SelectItem>
                        <SelectItem value="1">1 - Diminuído</SelectItem>
                        <SelectItem value="2">2 - Normal</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="apgarColor">Coloração das Mucosas (0-2)</Label>
                  <Select value={apgarColor} onValueChange={setApgarColor}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">0 - Cianótica</SelectItem>
                      <SelectItem value="1">1 - Pálida</SelectItem>
                      <SelectItem value="2">2 - Rosada</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button onClick={calculateApgar} className="w-full">
                  Calcular Escore Apgar
                </Button>

                {apgarResult && (
                  <Alert>
                    <Calculator className="h-4 w-4" />
                    <AlertDescription className="whitespace-pre-line">
                      {apgarResult}
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Seção de Anestésicos - Nova calculadora completa com dados atualizados */}
          <TabsContent value="anesthetics">
            <div className="max-w-4xl mx-auto">
              <Card className="bg-white shadow-lg rounded-2xl border-0">
                <CardHeader className="text-center pb-6">
                  <CardTitle className="text-2xl font-bold text-gray-800 flex items-center justify-center gap-2">
                    <Zap className="w-6 h-6 text-blue-600" />
                    💊 Calculadora de Sedoanalgesia
                  </CardTitle>
                  <CardDescription className="text-gray-600">
                    Lista resumida de fármacos e doses (mg/kg) - Cálculo automático com concentração
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 px-8 pb-8">
                  {/* Campos de entrada */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Espécie */}
                    <div className="space-y-2">
                      <Label htmlFor="anesthSpecies" className="text-sm font-medium text-gray-700">
                        Espécie
                      </Label>
                      <Select value={anesthSpecies} onValueChange={setAnesthSpecies}>
                        <SelectTrigger className="h-12 border-gray-300 rounded-lg focus:border-blue-400">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="dog">Cão</SelectItem>
                          <SelectItem value="cat">Gato</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Categoria */}
                    <div className="space-y-2">
                      <Label htmlFor="anesthCategory" className="text-sm font-medium text-gray-700">
                        Categoria
                      </Label>
                      <Select value={anesthCategory} onValueChange={setAnesthCategory}>
                        <SelectTrigger className="h-12 border-gray-300 rounded-lg focus:border-blue-400">
                          <SelectValue placeholder="Selecione a categoria" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="sedatives">🧘‍♂️ Sedativos / Tranquilizantes / Alfa-2 / Benzodiazepínicos</SelectItem>
                          <SelectItem value="opioids">💉 Opioides</SelectItem>
                          <SelectItem value="dissociatives">🌈 Dissociativos / Hipnóticos</SelectItem>
                          <SelectItem value="locals">🔬 Anestésicos Locais</SelectItem>
                          <SelectItem value="antagonists">🔄 Antagonistas / Reversores</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Fármaco */}
                    <div className="space-y-2">
                      <Label htmlFor="anesthDrug" className="text-sm font-medium text-gray-700">
                        Fármaco
                      </Label>
                      <Select value={anesthDrug} onValueChange={setAnesthDrug}>
                        <SelectTrigger className="h-12 border-gray-300 rounded-lg focus:border-blue-400">
                          <SelectValue placeholder={anesthCategory ? "Selecione o medicamento" : "Selecione a categoria primeiro"} />
                        </SelectTrigger>
                        <SelectContent>
                          {getFilteredDrugs().map(drug => (
                            <SelectItem key={drug.id} value={drug.id}>
                              {drug.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Peso */}
                    <div className="space-y-2">
                      <Label htmlFor="anesthWeight" className="text-sm font-medium text-gray-700">
                        Peso (kg)
                      </Label>
                      <Input
                        id="anesthWeight"
                        type="number"
                        step="0.01"
                        min="0.1"
                        value={anesthWeight}
                        onChange={(e) => setAnesthWeight(e.target.value)}
                        placeholder="Digite o peso em kg"
                        className="h-12 border-gray-300 rounded-lg focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
                      />
                    </div>

                    {/* Concentração (opcional) */}
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="anesthConcentration" className="text-sm font-medium text-gray-700">
                        Concentração (mg/mL) - Opcional para cálculo de volume
                      </Label>
                      <Input
                        id="anesthConcentration"
                        type="number"
                        step="0.01"
                        min="0.01"
                        value={anesthConcentration}
                        onChange={(e) => setAnesthConcentration(e.target.value)}
                        placeholder="Ex: 10 (para calcular volume em mL)"
                        className="h-12 border-gray-300 rounded-lg focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
                      />
                    </div>
                  </div>

                  {/* Botões */}
                  <div className="flex gap-3 pt-4">
                    <Button 
                      onClick={calculateAnesthetic} 
                      className="flex-1 h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-all"
                    >
                      Calcular Dose
                    </Button>
                    <Button 
                      onClick={clearAnesthetics}
                      variant="outline" 
                      className="flex-1 h-12 border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-all"
                    >
                      Limpar
                    </Button>
                  </div>

                  {/* Resultado */}
                  {anesthResult && (
                    <Alert className="mt-6 border-blue-200 bg-blue-50">
                      <Zap className="h-4 w-4 text-blue-600" />
                      <AlertDescription className="whitespace-pre-line text-blue-800 font-medium">
                        {anesthResult}
                      </AlertDescription>
                    </Alert>
                  )}

                  {/* Tabela de Referência Rápida - ATUALIZADA */}
                  <div className="mt-8 bg-gray-50 p-6 rounded-lg">
                    <h5 className="font-semibold mb-4 text-gray-800">📋 Tabela de Referência Rápida</h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                      <div>
                        <h6 className="font-semibold text-blue-600 mb-3">🧘‍♂️ Sedativos / Tranquilizantes</h6>
                        <div className="space-y-2 text-gray-600">
                          <div className="flex justify-between">
                            <span>Acepromazina:</span>
                            <span className="font-medium">0.03-0.2 mg/kg (IM/IV)</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Midazolam:</span>
                            <span className="font-medium">0.25-1.0 mg/kg (IM/IV)</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Dexmedetomidina:</span>
                            <span className="font-medium">0.001-0.01 mg/kg (IM/IV)</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Xilazina (Cão):</span>
                            <span className="font-medium">0.5-0.8 mg/kg (IM)</span>
                          </div>
                        </div>
                      </div>
                      <div>
                        <h6 className="font-semibold text-green-600 mb-3">💉 Opioides</h6>
                        <div className="space-y-2 text-gray-600">
                          <div className="flex justify-between">
                            <span>Morfina:</span>
                            <span className="font-medium">0.5-1.0 mg/kg (IM/IV)</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Metadona:</span>
                            <span className="font-medium">0.1-0.5 mg/kg (IM/IV)</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Tramadol:</span>
                            <span className="font-medium">2-6 mg/kg (IM/IV)</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Fentanil:</span>
                            <span className="font-medium">0.002-0.005 mg/kg (IV)</span>
                          </div>
                        </div>
                      </div>
                      <div>
                        <h6 className="font-semibold text-orange-600 mb-3">🌈 Dissociativos / Hipnóticos</h6>
                        <div className="space-y-2 text-gray-600">
                          <div className="flex justify-between">
                            <span>Cetamina:</span>
                            <span className="font-medium">0.6-10 mg/kg (IM/IV)</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Zoletil:</span>
                            <span className="font-medium">2-5 mg/kg (IM/IV)</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Propofol:</span>
                            <span className="font-medium">2-10 mg/kg (IV)</span>
                          </div>
                        </div>
                      </div>
                      <div>
                        <h6 className="font-semibold text-purple-600 mb-3">🔄 Antagonistas</h6>
                        <div className="space-y-2 text-gray-600">
                          <div className="flex justify-between">
                            <span>Atipamezol:</span>
                            <span className="font-medium">0.05-0.1 mg/kg (IM/IV)</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Naloxona:</span>
                            <span className="font-medium">0.04 mg/kg (IM/IV)</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Flumazenil:</span>
                            <span className="font-medium">0.005-0.05 mg/kg (IV)</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Precauções Gerais */}
                  <div className="bg-red-50 p-4 rounded-lg">
                    <h5 className="font-semibold text-red-800 mb-2">⚠️ Precauções Gerais:</h5>
                    <ul className="text-sm text-red-700 space-y-1">
                      <li>• Sempre monitorar sinais vitais durante sedação/analgesia</li>
                      <li>• Ter antagonistas disponíveis quando aplicável</li>
                      <li>• Considerar condições pré-existentes do paciente</li>
                      <li>• Ajustar doses conforme resposta individual</li>
                      <li>• Verificar compatibilidade entre medicamentos</li>
                      <li>• Doses em microgramas (µg) são automaticamente convertidas</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Aviso Legal e Isenção de Responsabilidade */}
        <div className="mt-12 bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-lg">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <div className="w-6 h-6 text-yellow-600 font-bold">⚠️</div>
            </div>
            <div className="ml-3">
              <h3 className="text-lg font-semibold text-yellow-800 mb-3">
                Aviso Legal e Isenção de Responsabilidade
              </h3>
              <div className="text-sm text-yellow-700 space-y-2">
                <p>
                  Este aplicativo tem finalidade exclusivamente educativa e de apoio à tomada de decisão clínica.
                  Os cálculos de doses, medicamentos e protocolos aqui apresentados são baseados em referências técnicas e devem ser sempre conferidos pelo(a) médico(a)-veterinário(a) responsável antes de qualquer administração ao paciente.
                </p>
                <p>
                  A desenvolvedora não se responsabiliza por erros de digitação, interpretação, uso inadequado das informações ou por eventuais consequências decorrentes da aplicação prática dos dados aqui contidos.
                </p>
                <p>
                  O uso deste aplicativo implica na aceitação integral deste termo, reconhecendo que a responsabilidade final pelas condutas clínicas e terapêuticas cabe exclusivamente ao profissional prescritor.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}