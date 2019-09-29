import React from 'react'
import Agorize from '@components/agorize'
import { agorizePost as agorize_post, redirected } from 'actions/agora'
import { useSelector, useDispatch } from 'react-redux'

export default function AgorizeContainer({ onAgorized = () => true, hypagora = "general", id, ...props }){

	const dispatch = useDispatch()
	const me = useSelector(state => state.Auth.profile.details._id)
	const dispatchAgorize = (info) => dispatch(agorize_post(info, me))
	const availableHypagoras = useSelector(state => state.Agora.availableHypagoras)
	const agorizing = useSelector(state => state.Agora.agorizing.indexOf(id) !== -1)
	const agorized = useSelector(state => state.Agora.agorized.indexOf(id) !== -1)
	const redirect = useSelector(state => state.Agora.redirect)
	if(agorized) {
		onAgorized(redirect)
		dispatch(redirected(id))
	}

	return (
		<Agorize
			agorize={dispatchAgorize}
			hypagora={hypagora}
			availableHypagoras={availableHypagoras}
			id={id}
			agorizing={agorizing}
			agorized={agorized}
			{...props}
		/>
	)
}
