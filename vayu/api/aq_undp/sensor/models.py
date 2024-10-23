from django.db import models

class DeviceType(models.IntegerChoices):
    """Choice values for the role field"""
    STATIC = (1, "Static")
    DYNAMIC = (2, "Dynamic")

class Device(models.Model):
    device_name  = models.CharField(max_length=200, blank=True)
    status = models.BooleanField(null=True, blank=True)
    device_type = models.PositiveSmallIntegerField(
        choices=DeviceType.choices,
        null=True,
        blank=True,
        verbose_name="Device Type"
    )
    sensor = models.CharField(max_length=200, blank=True)
    city = models.CharField(max_length=200, blank=True)
    location = models.CharField(max_length=200, blank=True)
    lat = models.FloatField(null=True, blank=True)
    long = models.FloatField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return str(self.id) + " | " + self.device_name

    class Meta:
        db_table = "device"
        verbose_name_plural = "Devices"
        
        
class Data(models.Model):
    device_id  = models.ForeignKey(Device, on_delete=models.CASCADE, null=True, blank=True)
    lat  = models.CharField(max_length=100, blank=True, verbose_name="Latitude")
    long  = models.CharField(max_length=100, blank=True, verbose_name="Longitude")
    pm_25  = models.FloatField(null= True, blank=True, verbose_name="PM 2.5")
    pm_10  = models.FloatField(null= True, blank=True, verbose_name="PM 10")
    no2  = models.FloatField(null= True, blank=True)
    co  = models.FloatField(null= True, blank=True)
    co2  = models.FloatField(null= True, blank=True)
    ch4  = models.FloatField(null= True, blank=True)
    temp  = models.FloatField(null= True, blank=True, verbose_name="Temperature")
    rh  = models.FloatField(null= True, blank=True, verbose_name="Relative Humidity")
    data_created_time  = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return str(self.id) + " | " + str(self.device_id)

    class Meta:
        db_table = "data"
        verbose_name_plural = "Data"


class DownloadData(models.Model):
    month  = models.CharField(max_length=200, blank=True)
    year = models.IntegerField(null=True, blank=True)
    city = models.CharField(max_length=200, blank=True)
    device_type = models.CharField(max_length=200, blank=True)
    user_name = models.CharField(max_length=200, blank=True)
    user_email = models.CharField(max_length=200, blank=True)
    usage_type = models.CharField(max_length=200, blank=True)
    purpose = models.CharField(max_length=200, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return str(self.id) + " | " + self.user_name

    class Meta:
        db_table = "download_data"
        verbose_name_plural = "Download Data"

class DownloadMonthYear(models.Model):
    month  = models.CharField(max_length=200, blank=True)
    year = models.IntegerField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return str(self.id) + " | " + self.month

    class Meta:
        db_table = "download_month_yar"
        verbose_name_plural = "Download Month"        

class DataTrend(models.Model):
    device_id  = models.ForeignKey(Device, on_delete=models.CASCADE, null=True, blank=True)
    city  = models.CharField(max_length=100, blank=True)
    sensor_type  = models.CharField(max_length=100, blank=True)
    pm_25_max  = models.FloatField(null= True, blank=True)
    pm_25_min  = models.FloatField(null= True, blank=True)
    pm_25_avg  = models.FloatField(null= True, blank=True)
    pm_25_var  = models.FloatField(null= True, blank=True)
    pm_25_stdev  = models.FloatField(null= True, blank=True)
    pm_25_median  = models.FloatField(null= True, blank=True)
    pm_10_max  = models.FloatField(null= True, blank=True)
    pm_10_min  = models.FloatField(null= True, blank=True)
    pm_10_avg  = models.FloatField(null= True, blank=True)
    pm_10_var  = models.FloatField(null= True, blank=True)
    pm_10_stdev  = models.FloatField(null= True, blank=True)
    pm_10_median  = models.FloatField(null= True, blank=True)
    no2_max  = models.FloatField(null= True, blank=True)
    no2_min  = models.FloatField(null= True, blank=True)
    no2_avg  = models.FloatField(null= True, blank=True)
    no2_var  = models.FloatField(null= True, blank=True)
    no2_stdev  = models.FloatField(null= True, blank=True)
    no2_median  = models.FloatField(null= True, blank=True)
    co_max  = models.FloatField(null= True, blank=True)
    co_min  = models.FloatField(null= True, blank=True)
    co_avg  = models.FloatField(null= True, blank=True)
    co_var  = models.FloatField(null= True, blank=True)
    co_stdev  = models.FloatField(null= True, blank=True)
    co_median  = models.FloatField(null= True, blank=True)
    co2_max  = models.FloatField(null= True, blank=True)
    co2_min  = models.FloatField(null= True, blank=True)
    co2_avg  = models.FloatField(null= True, blank=True)
    co2_var  = models.FloatField(null= True, blank=True)
    co2_stdev  = models.FloatField(null= True, blank=True)
    co2_median  = models.FloatField(null= True, blank=True)
    ch4_max  = models.FloatField(null= True, blank=True)
    ch4_min  = models.FloatField(null= True, blank=True)
    ch4_avg  = models.FloatField(null= True, blank=True)
    ch4_var  = models.FloatField(null= True, blank=True)
    ch4_stdev  = models.FloatField(null= True, blank=True)
    ch4_median  = models.FloatField(null= True, blank=True)
    temp_max  = models.FloatField(null= True, blank=True)
    temp_min  = models.FloatField(null= True, blank=True)
    temp_avg  = models.FloatField(null= True, blank=True)
    temp_var  = models.FloatField(null= True, blank=True)
    temp_stdev  = models.FloatField(null= True, blank=True)
    temp_median  = models.FloatField(null= True, blank=True)
    rh_max  = models.FloatField(null= True, blank=True)
    rh_min  = models.FloatField(null= True, blank=True)
    rh_avg  = models.FloatField(null= True, blank=True)
    rh_var  = models.FloatField(null= True, blank=True)
    rh_stdev  = models.FloatField(null= True, blank=True)
    rh_median  = models.FloatField(null= True, blank=True)
    data_count  = models.IntegerField(null= True, blank=True)
    data_created_date  = models.DateField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return str(self.id) + " | " + str(self.data_created_date)

    class Meta:
        db_table = "data_trend"
        verbose_name_plural = "Data Trend"
