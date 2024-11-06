import config from "../config/AllConfig"

const { APP_NAME, APP_VERSION } = config.envy

export default class CoreController {
  defaultMetadata: TMetadata
  metadata: TMetadata

  constructor() {
    this.defaultMetadata = {
      app: {
        name: APP_NAME,
        version: APP_VERSION,
      },
      title: APP_NAME,
    }
    this.metadata = this.defaultMetadata
  }
}
