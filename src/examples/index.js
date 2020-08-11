import { lazy } from 'react'

const examples =  {
    cube: { title: "Cube", _: lazy(() => import('./Cube'))},
    mouse: { title: "Mouse Interaction", _: lazy(() => import('./Mouse'))},
    sphere: { title: "Sphere", _: lazy(() => import('./Sphere'))},
    octa: { title: "Octa", _: lazy(() => import('./Octa'))}
}

export default examples
