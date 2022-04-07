import type { ActionFunction } from '@remix-run/cloudflare';
import { useActionData } from '@remix-run/react';
import { json } from '@remix-run/server-runtime';
import { withZod } from '@remix-validated-form/with-zod';
import { ValidatedForm, validationError } from 'remix-validated-form';
import { z } from 'zod';
import { FormInput } from '~/components/FormInput';

export const validator = withZod(
  z.object({
    firstName: z.string().nonempty('First name is required'),
    lastName: z.string().nonempty('Last name is required'),
    email: z
      .string()
      .nonempty('Email is required')
      .email('Must be a valid email'),
  }),
);

export const action: ActionFunction = async ({ request }) => {
  const data = await validator.validate(await request.formData());
  if (data.error) return validationError(data.error);
  const { firstName, lastName, email } = data.data;

  return json({
    title: `Hi ${firstName} ${lastName}!`,
    description: `Your email is ${email}`,
  });
};

export default function Index() {
  const data = useActionData();

  return (
    <ValidatedForm validator={validator} method='post'>
      <FormInput name='firstName' label='First Name' />
      <FormInput name='lastName' label='Last Name' />
      <FormInput name='email' label='Email' />
      {data && (
        <p>
          {data.title} {data.description}
        </p>
      )}
      <button type='submit'>submit</button>
    </ValidatedForm>
  );
}
