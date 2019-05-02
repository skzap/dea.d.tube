Template.election.helpers({
    leaders: function(){
        var leaders = Session.get('leaders')
        for (let i = 0; i < leaders.length; i++)
            leaders[i].position = i+1
        return leaders
    },
    isVotingFor: function(name){
        var user = Users.findOne({username: Session.get('activeUsername')})
        if (user && user.approves && user.approves.indexOf(name) > -1)
            return true

        return false
    },
    myOtherVotes: function(){
        var leaders = Session.get('leaders')
        var user = Users.findOne({username: Session.get('activeUsername')})
        var approves = []
        if (user && user.approves) approves = user.approves
        for (let i = 0; i < leaders.length; i++)
            if (approves.indexOf(leaders[i].name) > -1)
                approves.splice(approves.indexOf(leaders[i].name), 1)
        
        return approves
    }
})

Template.election.events({
    'click #votenew': function() {
        var username = $('#newleader').val()
        $('#newleader').val('')
        broadcast.voteLeader(username, function (err, result) {
            if (err) toastr.error(Meteor.blockchainError(err))
            else {
                avalon.getLeaders(function(err, res){
                    Session.set('leaders', res)
                })
                Users.refreshUsers([Session.get('activeUsername')])
                toastr.success(translate('GLOBAL_VOTE_LEADER', username))
            }
        })
    },
    'click .votetop': function(clickEvent) {
        var button = clickEvent.target
        var username = button.parentElement.getAttribute('data-username')
        broadcast.voteLeader(username, function (err, result) {
            if (err) toastr.error(Meteor.blockchainError(err))
            else {
                avalon.getLeaders(function(err, res){
                    Session.set('leaders', res)
                })
                Users.refreshUsers([Session.get('activeUsername')])
                toastr.success(translate('GLOBAL_VOTE_LEADER', username))
            }
        })
    },
    'click .unvotetop': function(clickEvent) {
        var button = clickEvent.target
        var username = button.parentElement.getAttribute('data-username')
        broadcast.unvoteLeader(username, function (err, result) {
            if (err) toastr.error(Meteor.blockchainError(err))
            else {
                avalon.getLeaders(function(err, res){
                    Session.set('leaders', res)
                })
                Users.refreshUsers([Session.get('activeUsername')])
                toastr.success(translate('GLOBAL_UNVOTE_LEADER', username))
            }
        })
    }
})