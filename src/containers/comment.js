import React from 'react'
// import { Actions, Comments } from 'containers'
import Actions from 'containers/actions'
import Comments from 'containers/comments'
// import { Comment } from '@components'
import Comment from '@components/comment'
import { connect } from 'react-redux'

const mapStateToProps = (state, props) => {
	let comment = state.Agora.agoragrams[props.id]
	return {
		comment,
		stars: comment.stars
	}
}

const CommentContainer = ({ comment }) => {
	return (
		<Comment comment={comment}>
			<Actions
				id={comment._id}
			/>
			{
				comment.children.length !== 0 &&
				<Comments children={comment.children} />
			}
		</Comment>
	)
}

export default connect(mapStateToProps)(CommentContainer)