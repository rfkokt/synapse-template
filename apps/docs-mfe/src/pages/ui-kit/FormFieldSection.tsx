import * as yup from 'yup';
import { Button, Input, Card, CardContent, FormField, useFormValidation } from '@synapse/ui-kit';
import { useNotificationStore } from '@synapse/shared-types';
import { SectionHeader, PreviewCard, CodeBlock, PropsTable } from './shared';

const demoSchema = yup.object({
  nama: yup.string().required('Nama wajib diisi').min(3, 'Nama minimal 3 karakter'),
  email: yup.string().required('Email wajib diisi').email('Format email tidak valid'),
  umur: yup
    .string()
    .required('Umur wajib diisi')
    .test('is-number', 'Umur harus angka', (v) => !v || !isNaN(Number(v)))
    .test('min-age', 'Minimal umur 17 tahun', (v) => !v || Number(v) >= 17),
  telepon: yup
    .string()
    .required('Nomor telepon wajib diisi')
    .matches(/^[0-9]+$/, 'Hanya angka')
    .min(10, 'Minimal 10 digit'),
});

export function FormFieldSection() {
  const { errors, touched, handleSubmit, isSubmitting, reset, getFieldProps } = useFormValidation({
    schema: demoSchema,
    initialValues: { nama: '', email: '', umur: '', telepon: '' },
    onSubmit: async (data) => {
      await new Promise((r) => setTimeout(r, 1000));
      useNotificationStore
        .getState()
        .success(`Form terkirim! Nama: ${data.nama}, Email: ${data.email}`);
      reset();
    },
  });

  return (
    <Card>
      <CardContent className="pt-6 space-y-6">
        <SectionHeader
          title="Form Validation"
          description="Validasi form menggunakan useFormValidation hook + Yup schema."
        />

        <PreviewCard title="Live Demo — Coba isi dan submit">
          <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
            <FormField
              name="nama"
              label="Nama Lengkap"
              required
              error={touched.nama ? errors.nama : undefined}
            >
              {(() => {
                const { error: _, ...p } = getFieldProps('nama');
                return <Input {...p} placeholder="Masukkan nama..." />;
              })()}
            </FormField>

            <FormField
              name="email"
              label="Email"
              required
              error={touched.email ? errors.email : undefined}
            >
              {(() => {
                const { error: _, ...p } = getFieldProps('email');
                return <Input {...p} type="email" placeholder="email@example.com" />;
              })()}
            </FormField>

            <FormField
              name="umur"
              label="Umur"
              required
              error={touched.umur ? errors.umur : undefined}
              hint="Minimal 17 tahun"
            >
              {(() => {
                const { error: _, ...p } = getFieldProps('umur');
                return <Input {...p} placeholder="25" />;
              })()}
            </FormField>

            <FormField
              name="telepon"
              label="No. Telepon"
              required
              error={touched.telepon ? errors.telepon : undefined}
            >
              {(() => {
                const { error: _, ...p } = getFieldProps('telepon');
                return <Input {...p} placeholder="08xxxxxxxxxx" />;
              })()}
            </FormField>

            <div className="flex gap-3 pt-2">
              <Button type="submit" isLoading={isSubmitting}>
                Kirim
              </Button>
              <Button type="button" variant="outline" onClick={reset}>
                Reset
              </Button>
            </div>
          </form>
        </PreviewCard>

        <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
          1. Definisikan Schema
        </h3>
        <CodeBlock>{`import * as yup from 'yup';

const schema = yup.object({
  nama: yup.string()
    .required('Nama wajib diisi')
    .min(3, 'Nama minimal 3 karakter'),
  email: yup.string()
    .required('Email wajib diisi')
    .email('Format email tidak valid'),
  umur: yup.string()
    .required('Umur wajib diisi')
    .test('min-age', 'Minimal 17', (v) => Number(v) >= 17),
  telepon: yup.string()
    .required('Telepon wajib diisi')
    .matches(/^[0-9]+$/, 'Hanya angka')
    .min(10, 'Minimal 10 digit'),
});`}</CodeBlock>

        <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
          2. Gunakan Hook
        </h3>
        <CodeBlock>{`import { useFormValidation, FormField, Input, Button } from '@synapse/ui-kit';

function MyForm() {
  const { handleSubmit, getFieldProps, isSubmitting, reset, touched, errors } = useFormValidation({
    schema,
    initialValues: { nama: '', email: '', umur: '', telepon: '' },
    onSubmit: async (data) => {
      await api.post('/jamaah', data);
    },
  });

  return (
    <form onSubmit={handleSubmit}>
      <FormField name="nama" label="Nama" required error={touched.nama ? errors.nama : undefined}>
        <Input {...getFieldProps('nama')} placeholder="Nama..." />
      </FormField>

      <FormField name="email" label="Email" required error={touched.email ? errors.email : undefined}>
        <Input {...getFieldProps('email')} type="email" />
      </FormField>

      <Button type="submit" isLoading={isSubmitting}>Simpan</Button>
      <Button type="button" variant="outline" onClick={reset}>Reset</Button>
    </form>
  );
}`}</CodeBlock>

        <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
          useFormValidation Props
        </h3>
        <PropsTable
          rows={[
            ['schema', 'yup.ObjectSchema<T>', '—'],
            ['initialValues', 'T', '—'],
            ['onSubmit', '(values: T) => void | Promise', '—'],
            ['validateOnChange', 'boolean', 'false'],
          ]}
        />

        <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 mt-4">
          Return Values
        </h3>
        <PropsTable
          rows={[
            ['values', 'T', 'Current form values'],
            ['errors', 'Partial<Record<keyof T, string>>', 'Validation errors'],
            ['touched', 'Partial<Record<keyof T, boolean>>', 'Touched fields'],
            ['isSubmitting', 'boolean', 'Submit in progress'],
            ['isValid', 'boolean', 'No errors'],
            ['handleChange', '(field) => onChange handler', '—'],
            ['handleBlur', '(field) => onBlur handler', '—'],
            ['handleSubmit', '(e?) => Promise<void>', '—'],
            ['getFieldProps', '(field) => { value, onChange, onBlur, error }', '—'],
            ['setValue', '(field, value) => void', '—'],
            ['reset', '() => void', '—'],
          ]}
        />

        <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 mt-4">
          FormField Props
        </h3>
        <PropsTable
          rows={[
            ['name', 'string', '—'],
            ['label', 'string', '—'],
            ['error', 'string', '—'],
            ['hint', 'string', '—'],
            ['required', 'boolean', 'false'],
            ['children', 'ReactNode', '—'],
          ]}
        />
      </CardContent>
    </Card>
  );
}
