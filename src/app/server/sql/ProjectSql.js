
module.exports = {
  getProjectCount: 'select count(*) as count from project',
  apply: 'insert into project_supporters(user_id, project_d) values (?, ?)',
  getProjects:
    "select project_name as id, project_name as name, purpose, website, " +
    " concat('[', group_concat(quote(tool)), ']') as tools, " +
    " concat('[', group_concat(quote(needs)), ']') as needs, " +
    " case when (user_id is null) then false else true end " +
    "from project p " +
    " left outer join project_tools pt on p.project_id = pt.project_id " +
    " left outer join project_needs pn on p.project_id = pn.project_id " +
    " left outer join project_supporters ps " +
    "   on p.project_id = ps.project_id and ps.user_id = ? " +
    "limit ?, ?"
};
