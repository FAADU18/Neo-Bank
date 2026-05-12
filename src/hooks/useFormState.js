import { useState } from 'react';

export function useFormState(initialState) {
  const [values, setValues] = useState(initialState);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setValues((current) => ({
      ...current,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const reset = () => setValues(initialState);

  return { values, setValues, handleChange, reset };
}
