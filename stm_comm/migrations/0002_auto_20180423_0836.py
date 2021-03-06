# Generated by Django 2.0.3 on 2018-04-23 08:36

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('stm_comm', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='TempItem',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('value', models.CharField(default=0, max_length=30)),
                ('time', models.DateTimeField(default=django.utils.timezone.now)),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.RemoveField(
            model_name='item',
            name='device',
        ),
        migrations.AddField(
            model_name='device',
            name='user',
            field=models.ForeignKey(default=None, on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL),
            preserve_default=False,
        ),
        migrations.DeleteModel(
            name='Item',
        ),
        migrations.AddField(
            model_name='tempitem',
            name='device',
            field=models.ForeignKey(default=None, on_delete=django.db.models.deletion.CASCADE, to='stm_comm.Device'),
        ),
    ]
