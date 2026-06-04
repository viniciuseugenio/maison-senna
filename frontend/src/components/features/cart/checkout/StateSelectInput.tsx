import { SelectInput } from "@/components/ui";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useFormContext } from "react-hook-form";

interface States {
  id: number;
  sigla: string;
  nome: string;
  regiao: {
    id: number;
    sigla: string;
    nome: string;
  };
}

const StateSelectInput: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { setValue, watch } = useFormContext();
  const selectedState = watch("state");

  const { data: states } = useQuery({
    queryFn: async () => {
      const response = await fetch(
        "https://servicodados.ibge.gov.br/api/v1/localidades/estados",
      );
      const data: States[] = await response.json();
      return data;
    },
    queryKey: ["brazilStates"],
  });

  const statesByAcronym = states
    ? Object.fromEntries(states.map((state) => [state.sigla, state.nome]))
    : {};

  return (
    <SelectInput
      label="STATE (UF)"
      selectedValue={statesByAcronym[selectedState]}
      isOpen={isOpen}
      setIsOpen={setIsOpen}
    >
      {states &&
        states.map((state) => (
          <SelectInput.Option
            onClick={() => {
              setValue("state", state.sigla);
              setIsOpen(false);
            }}
            value={state.sigla}
            isSelected={selectedState === state.sigla}
            key={state.id}
          >
            {state.nome}
          </SelectInput.Option>
        ))}
    </SelectInput>
  );
};

export default StateSelectInput;
