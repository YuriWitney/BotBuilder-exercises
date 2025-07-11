import { type PromptValidatorContext } from 'botbuilder-dialogs'

export const agePromptValidator = async (promptContext: PromptValidatorContext<number>): Promise<boolean> => {
  if (!promptContext.recognized.value) {
    throw new Error('Valor não reconhecido')
  }
  return promptContext.recognized.succeeded && promptContext.recognized.value > 0 && promptContext.recognized.value < 100
}
