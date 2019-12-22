import { observable, action } from 'mobx'

class UserStore {
  @observable data = 'supercalifragilisticexpialidocious'
}

export default new UserStore()
