import * as yup from 'yup';
import { Button, Input, Card, CardContent, FormField, useFormValidation } from '@synapse/ui-kit';
import { useNotificationStore } from '@synapse/shared-types';
import { CodeBlock, SectionHeader, PreviewCard, ExampleTabs, PropsTable } from './shared';

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

const basicUsageCode = `import { FormField, Input } from '@synapse/ui-kit';

<FormField
  name="email"
  label="Email"
  required
  hint="Kami tidak akan membagikan email Anda."
>
  <Input id="email" name="email" type="email" placeholder="email@example.com" />
</FormField>

<FormField
  name="password"
  label="Password"
  error="Password minimal 8 karakter"
>
  <Input id="password" name="password" type="password" placeholder="********" />
</FormField>;`;

const schemaCode = `import * as yup from 'yup';

const schema = yup.object({
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
});`;

const hookUsageCode = `import { useFormValidation, FormField, Input, Button } from '@synapse/ui-kit';

const {
  errors,
  touched,
  handleSubmit,
  isSubmitting,
  getFieldProps,
  reset,
} = useFormValidation({
  schema,
  initialValues: { nama: '', email: '', umur: '', telepon: '' },
  onSubmit: async (values) => {
    await apiClient.post('/api/users', values);
  },
});

const getInputProps = (field) => {
  const { error: _error, ...inputProps } = getFieldProps(field);
  return inputProps;
};

<form onSubmit={handleSubmit}>
  <FormField name="nama" label="Nama Lengkap" required error={touched.nama ? errors.nama : undefined}>
    <Input {...getInputProps('nama')} placeholder="Masukkan nama..." />
  </FormField>

  <FormField name="email" label="Email" required error={touched.email ? errors.email : undefined}>
    <Input {...getInputProps('email')} type="email" placeholder="email@example.com" />
  </FormField>

  <Button type="submit" isLoading={isSubmitting}>Kirim</Button>
  <Button type="button" variant="outline" onClick={reset}>Reset</Button>
</form>;`;

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
  const getInputProps = (field: 'nama' | 'email' | 'umur' | 'telepon') => {
    const { error: _error, ...inputProps } = getFieldProps(field);
    return inputProps;
  };

  return (
    <Card>
      <CardContent className="pt-6 space-y-6">
        <SectionHeader
          title="FormField"
          description="Wrapper untuk label, hint, dan error. Cocok dipakai bersama useFormValidation + Yup."
        />

        <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
          <PreviewCard title="Basic Usage" className="mb-0 h-full">
            <ExampleTabs
              preview={
                <div className="w-full max-w-md space-y-4">
                  <FormField
                    name="email"
                    label="Email"
                    required
                    hint="Kami tidak akan membagikan email Anda."
                  >
                    <Input id="email" name="email" type="email" placeholder="email@example.com" />
                  </FormField>
                  <FormField name="password" label="Password" error="Password minimal 8 karakter">
                    <Input id="password" name="password" type="password" placeholder="********" />
                  </FormField>
                </div>
              }
              code={basicUsageCode}
              previewClassName="w-full items-start justify-center"
            />
          </PreviewCard>

          <PreviewCard title="Live Validation Demo" className="mb-0 h-full">
            <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <FormField
                name="nama"
                label="Nama Lengkap"
                required
                error={touched.nama ? errors.nama : undefined}
              >
                <Input {...getInputProps('nama')} placeholder="Masukkan nama..." />
              </FormField>

              <FormField
                name="email"
                label="Email"
                required
                error={touched.email ? errors.email : undefined}
              >
                <Input {...getInputProps('email')} type="email" placeholder="email@example.com" />
              </FormField>

              <FormField
                name="umur"
                label="Umur"
                required
                error={touched.umur ? errors.umur : undefined}
                hint="Minimal 17 tahun"
              >
                <Input {...getInputProps('umur')} placeholder="25" />
              </FormField>

              <FormField
                name="telepon"
                label="No. Telepon"
                required
                error={touched.telepon ? errors.telepon : undefined}
              >
                <Input {...getInputProps('telepon')} placeholder="08xxxxxxxxxx" />
              </FormField>

              <div className="flex gap-3 pt-1 md:col-span-2">
                <Button type="submit" isLoading={isSubmitting}>
                  Kirim
                </Button>
                <Button type="button" variant="outline" onClick={reset}>
                  Reset
                </Button>
              </div>
            </form>
          </PreviewCard>
        </div>

        <PreviewCard title="Integrasi useFormValidation + Yup" className="mb-0">
          <div className="w-full max-w-2xl text-sm text-neutral-600 dark:text-neutral-400 space-y-2">
            <p>1. Definisikan schema Yup.</p>
            <p>2. Inisialisasi hook useFormValidation.</p>
            <p>3. Hubungkan getFieldProps ke Input lalu tampilkan error di FormField.</p>
          </div>
          <CodeBlock codeString={hookUsageCode} language="tsx" />
        </PreviewCard>

        <PreviewCard title="Schema Example" className="mb-0">
          <CodeBlock codeString={schemaCode} language="tsx" />
        </PreviewCard>

        <PreviewCard title="Catatan Penggunaan" className="mb-0">
          <div className="space-y-2 text-sm text-neutral-600 dark:text-neutral-400">
            <p>FormField dipakai untuk wrapper label, hint, dan error di satu tempat.</p>
            <p>
              Jika memakai FormField, hindari mengisi label, hint, atau error di Input agar tidak
              duplikat.
            </p>
            <p>
              Pastikan id pada input sama dengan name FormField supaya relasi label tetap benar.
            </p>
          </div>
        </PreviewCard>

        <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
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
            ['className', 'string', '—'],
          ]}
        />

        <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 mt-4">
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
      </CardContent>
    </Card>
  );
}
