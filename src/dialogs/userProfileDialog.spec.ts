import {
  TestAdapter,
  ConversationState,
  MemoryStorage,
  UserState,
  TurnContext,
  Activity
} from 'botbuilder';
import { DialogTurnStatus, DialogSet } from 'botbuilder-dialogs';

import { UserProfileDialog }from '../dialogs/userProfileDialog';

describe('', function () {
  it('', (done) => {
      const testData = setCommonData();

      const dialogs = new DialogSet(
          testData.auraDataAccesor.dialogStateAccessor
      );
      const testDialog: UserProfileDialog =
          new UserProfileDialog(testData.auraDataAccesor.dialogStateAccessor);
      dialogs.add(testDialog);

      const adapter = new TestAdapter(async (turnContext: TurnContext) => {
          const dc = await dialogs.createContext(turnContext);
          const results = await dc.continueDialog();
          if (results.status === DialogTurnStatus.empty) {
              await dc.beginDialog(UserProfileDialog.id);
          }
          await testData.conversationState.saveChanges(turnContext);
      });

      adapter
          .send('Não')
          .assertReply((activity: Activity) => {
              const assertText = activity.text != null ? activity.text : null;
              expect(assertText).toBe('errors:error.unexpected');
          })
          .then(() => {
              done();
          })
          .catch((err: any) => done(err));
  });
});

function setCommonData(): any {
  const memoryStorage = new MemoryStorage();
  const conversationState = new ConversationState(memoryStorage);
  const auraDataAccesor = {
    dialogStateAccessor: conversationState.createProperty(
        'dialogStateAccessor'
    )
  };
  return {
      auraDataAccesor,
      conversationState
  };
}
