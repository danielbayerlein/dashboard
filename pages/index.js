import { name } from '../package.json'
import Header from '../components/header'
import DateTime from '../components/widgets/datetime'
import PageSpeedScore from '../components/widgets/psi'

export default () => (
  <div>
    <Header title={name} />
    <DateTime />
    <PageSpeedScore url='https://github.com/' />
  </div>
)
