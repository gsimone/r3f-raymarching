import { lazy } from 'react'

const examples =  {
    cube: { title: "Cube", _: lazy(() => import('./Cube'))},
    mouse: { title: "Mouse Interaction", _: lazy(() => import('./Mouse'))}
}

export default examples
