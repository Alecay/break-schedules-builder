let originalLink = "https://greenfield.target.com/card/1732305?$filters@$ref_id=rjavftcxo5&field_name=job_area_a&obj_type=column&type=in&pattern@=Front%20Lanes;&display_name=Job%20Area&dimension=job_area_a;&$type=in&dimension=home_location&display_name=Store&ref_id=rxdxp8x5pcc&obj_type=column&pattern@=T1061;;;&timePeriod$calendar_type=Fiscal&granularity=All&interval=(this.day.begin,%20this.week.end%20%3E%3E%201%20week)&type=relative";

function getScheduleDataLink(store)
{
    var link = originalLink.replace("T1061", store);    

    return link;
}