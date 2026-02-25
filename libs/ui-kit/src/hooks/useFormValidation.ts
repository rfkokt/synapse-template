import { useState, useCallback, useRef } from 'react';
import type { ObjectSchema, ValidationError } from 'yup';

/**
 * useFormValidation — lightweight form state + Yup schema validation.
 *
 * Usage:
 *   const schema = yup.object({ email: yup.string().email().required() });
 *   const { values, errors, touched, handleChange, handleBlur, handleSubmit } = useFormValidation({
 *     schema,
 *     initialValues: { email: '' },
 *     onSubmit: (data) => console.log(data),
 *   });
 */

export interface UseFormValidationOptions<T extends Record<string, unknown>> {
  /** Yup object schema for validation */
  schema: ObjectSchema<T>;
  /** Initial form values */
  initialValues: T;
  /** Called when form is valid and submitted */
  onSubmit: (values: T) => void | Promise<void>;
  /** Validate on change (default: false — validates on blur) */
  validateOnChange?: boolean;
}

export interface UseFormValidationReturn<T extends Record<string, unknown>> {
  /** Current form values */
  values: T;
  /** Error messages keyed by field name */
  errors: Partial<Record<keyof T, string>>;
  /** Which fields have been touched (blurred) */
  touched: Partial<Record<keyof T, boolean>>;
  /** Whether form is currently submitting */
  isSubmitting: boolean;
  /** Whether form is valid (no errors) */
  isValid: boolean;
  /** Set a single field value */
  setValue: (field: keyof T, value: T[keyof T]) => void;
  /** Handle input onChange event */
  handleChange: (field: keyof T) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  /** Handle input onBlur event — triggers field validation */
  handleBlur: (field: keyof T) => () => void;
  /** Handle form submit — validates all fields first */
  handleSubmit: (e?: React.FormEvent) => Promise<void>;
  /** Reset form to initial values */
  reset: () => void;
  /** Set all errors manually */
  setErrors: (errors: Partial<Record<keyof T, string>>) => void;
  /** Get field props helper — returns { value, onChange, onBlur, error } */
  getFieldProps: (field: keyof T) => {
    id: string;
    name: string;
    value: T[keyof T];
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
    onBlur: () => void;
    error: string | undefined;
  };
}

export function useFormValidation<T extends Record<string, unknown>>({
  schema,
  initialValues,
  onSubmit,
  validateOnChange = false,
}: UseFormValidationOptions<T>): UseFormValidationReturn<T> {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const schemaRef = useRef(schema);
  schemaRef.current = schema;

  // Validate a single field
  const validateField = useCallback(
    async (field: keyof T, value: T[keyof T]) => {
      try {
        await schemaRef.current.validateAt(field as string, { ...values, [field]: value });
        setErrors((prev) => {
          const next = { ...prev };
          delete next[field];
          return next;
        });
      } catch (err) {
        const yupError = err as ValidationError;
        setErrors((prev) => ({ ...prev, [field]: yupError.message }));
      }
    },
    [values]
  );

  // Validate all fields
  const validateAll = useCallback(async (): Promise<boolean> => {
    try {
      await schemaRef.current.validate(values, { abortEarly: false });
      setErrors({});
      return true;
    } catch (err) {
      const yupError = err as ValidationError;
      const newErrors: Partial<Record<keyof T, string>> = {};
      yupError.inner.forEach((e) => {
        if (e.path) {
          newErrors[e.path as keyof T] = e.message;
        }
      });
      setErrors(newErrors);
      // Mark all fields as touched
      const allTouched: Partial<Record<keyof T, boolean>> = {};
      Object.keys(initialValues).forEach((key) => {
        allTouched[key as keyof T] = true;
      });
      setTouched(allTouched);
      return false;
    }
  }, [values, initialValues]);

  const setValue = useCallback(
    (field: keyof T, value: T[keyof T]) => {
      setValues((prev) => ({ ...prev, [field]: value }));
      if (validateOnChange) {
        validateField(field, value);
      }
    },
    [validateOnChange, validateField]
  );

  const handleChange = useCallback(
    (field: keyof T) =>
      (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const value = e.target.value as T[keyof T];
        setValue(field, value);
      },
    [setValue]
  );

  const handleBlur = useCallback(
    (field: keyof T) => () => {
      setTouched((prev) => ({ ...prev, [field]: true }));
      validateField(field, values[field]);
    },
    [validateField, values]
  );

  const handleSubmit = useCallback(
    async (e?: React.FormEvent) => {
      e?.preventDefault();
      setIsSubmitting(true);
      const valid = await validateAll();
      if (valid) {
        await onSubmit(values);
      }
      setIsSubmitting(false);
    },
    [validateAll, onSubmit, values]
  );

  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  }, [initialValues]);

  const getFieldProps = useCallback(
    (field: keyof T) => ({
      id: field as string,
      name: field as string,
      value: values[field],
      onChange: handleChange(field),
      onBlur: handleBlur(field),
      error: touched[field] ? errors[field] : undefined,
    }),
    [values, errors, touched, handleChange, handleBlur]
  );

  const isValid = Object.keys(errors).length === 0;

  return {
    values,
    errors,
    touched,
    isSubmitting,
    isValid,
    setValue,
    handleChange,
    handleBlur,
    handleSubmit,
    reset,
    setErrors,
    getFieldProps,
  };
}
