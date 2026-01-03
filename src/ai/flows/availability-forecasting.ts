// src/ai/flows/availability-forecasting.ts
'use server';

/**
 * @fileOverview A flow for forecasting classroom availability based on historical data.
 *
 * - forecastAvailability - A function that forecasts classroom availability.
 * - ForecastAvailabilityInput - The input type for the forecastAvailability function.
 * - ForecastAvailabilityOutput - The return type for the forecastAvailability function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ForecastAvailabilityInputSchema = z.object({
  classroomId: z.string().describe('The ID of the classroom to forecast availability for.'),
  historicalData: z.string().describe('Historical data of classroom usage patterns.'),
});
export type ForecastAvailabilityInput = z.infer<typeof ForecastAvailabilityInputSchema>;

const ForecastAvailabilityOutputSchema = z.object({
  forecast: z.string().describe('A forecast of the classroom availability.'),
});
export type ForecastAvailabilityOutput = z.infer<typeof ForecastAvailabilityOutputSchema>;

export async function forecastAvailability(input: ForecastAvailabilityInput): Promise<ForecastAvailabilityOutput> {
  return forecastAvailabilityFlow(input);
}

const forecastAvailabilityPrompt = ai.definePrompt({
  name: 'forecastAvailabilityPrompt',
  input: {schema: ForecastAvailabilityInputSchema},
  output: {schema: ForecastAvailabilityOutputSchema},
  prompt: `You are an AI assistant that forecasts classroom availability based on historical data.

  Analyze the following historical data for classroom {{{classroomId}}}:
  {{{historicalData}}}

  Provide a forecast of the classroom's availability:
  `,
});

const forecastAvailabilityFlow = ai.defineFlow(
  {
    name: 'forecastAvailabilityFlow',
    inputSchema: ForecastAvailabilityInputSchema,
    outputSchema: ForecastAvailabilityOutputSchema,
  },
  async input => {
    const {output} = await forecastAvailabilityPrompt(input);
    return output!;
  }
);
