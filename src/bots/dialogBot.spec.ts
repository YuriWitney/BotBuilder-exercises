import { MemoryStorage, ConversationState, UserState, ConfigurationBotFrameworkAuthentication, CloudAdapter, type ConfigurationBotFrameworkAuthenticationOptions } from 'botbuilder'
import { UserProfileDialog } from '../dialogs/userProfileDialog'
import { DialogBot } from './dialogBot'
import { config } from 'dotenv'
import * as path from 'path'
import supertest from 'supertest'
import { server } from '../../src'

afterEach(() => {
  server.close()
})

describe('DialogBot tests', () => {
  it('', async () => {
    const testData = setCommonData()

    const dialog = new UserProfileDialog(testData.userState)
    const sut = new DialogBot(testData.conversationState, testData.auraDataAccesor, dialog)
    const ENV_FILE = path.join(__dirname, '.env')
    config({ path: ENV_FILE })

    const botFrameworkAuthentication = new ConfigurationBotFrameworkAuthentication(process.env as ConfigurationBotFrameworkAuthenticationOptions)
    const adapter = new CloudAdapter(botFrameworkAuthentication)

    await supertest(server).post('/api/messages', async (req, res: any): Promise<void> => {
      await adapter.process(req, res, async (context) => { await sut.run(context) })
    }).then((response) => {
      expect(response.status).toBe(400)
    })
  })
})

function setCommonData (): any {
  const memoryStorage = new MemoryStorage()
  const conversationState = new ConversationState(memoryStorage)
  const userSate = new UserState(memoryStorage)
  const auraDataAccesor = {
    dialogStateAccessor: conversationState.createProperty(
      'dialogStateAccessor'
    )
  }
  return {
    auraDataAccesor,
    conversationState,
    userSate
  }
}
