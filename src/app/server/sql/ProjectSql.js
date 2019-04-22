
module.exports = {
  getProjectCount: 'select count(*) as count from project',

  apply: 'insert into project_supporters(user_id, project_id) values (?, ?)',

  getProjects:
    "select p.project_id as id, project_name as name, purpose, website, " +
    " group_concat(distinct quote(tool) order by tool) as tools, " +
    " group_concat(distinct quote(needs) order by needs) as needs, " +
    " case when (user_id is null) then false else true end as applied " +
    "from project p " +
    " left outer join project_tools pt on p.project_id = pt.project_id " +
    " left outer join project_needs pn on p.project_id = pn.project_id " +
    " left outer join project_supporters ps " +
    "   on p.project_id = ps.project_id and ps.user_id = ? " +
    "group by p.project_id " +
    "limit ?, ?",

  addProject: "insert into project(project_name, purpose, website) values (?, ?, ?)",

  getProjectId:
    "select project_id " +
    "from project " +
    "where project_name = ? " +
    "  and purpose = ?",

  addTools: "insert into project_tools(project_id, tool) values ",

  addNeeds: "insert into project_needs(project_id, needs) values ",

  dynamicParams: "(?, ?)"
};
